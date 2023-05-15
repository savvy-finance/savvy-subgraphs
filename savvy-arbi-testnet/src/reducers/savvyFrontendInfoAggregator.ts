import { Address, BigInt, log, TypedMap } from '@graphprotocol/graph-ts';
import { SavvyFrontendInfoAggregator as SavvyFrontendInfoAggregatorContract } from '../../generated/SavvyFrontendInfoAggregator/SavvyFrontendInfoAggregator';
import { AccountBalance } from '../../generated/schema';
import { ADDRESS_TO_CONTRACTS_MAP } from '../constants/addressToContractMap';
import { getOrCreateAccount, getOrCreateAccountBalance, getOrCreateStrategy, getOrCreateStrategyBalance } from '../utils/entities';

export function syncUserPosition(accountAddress: Address): void {
    const savvyFrontendInfoAggregator = SavvyFrontendInfoAggregatorContract.bind(Address.fromString("0x3056AA8a7E85bA9EB36b6Af8B98d3a28024b7D94"));
    
    if (!savvyFrontendInfoAggregator) {
        return;
    }

    const poolsPageInfoResult = savvyFrontendInfoAggregator.try_getPoolsPageInfo(accountAddress);
    if (poolsPageInfoResult.reverted) {
        log.warning("Failed to load pools page for account={}", [accountAddress.toHexString()]);
        return;
    }
    const poolsPageInfo = poolsPageInfoResult.value;

    let totalDepositedUSD = BigInt.zero();
    let totalDebtUSD = BigInt.zero();
    const account = getOrCreateAccount(accountAddress.toHexString());
    const syntheticTypeToAccountBalanceMap = new TypedMap<string, AccountBalance>();
    for (let i = 0; i < poolsPageInfo.pools.length; i++) {
        const pool = poolsPageInfo.pools[i];
        const savvyPositionManagerAddress = pool.savvyPositionManager.toHexString();
        const contractDetails = ADDRESS_TO_CONTRACTS_MAP.get(savvyPositionManagerAddress);
        if (!contractDetails) {
            continue;
        }
        let syntheticType = contractDetails.get("syntheticType");
        if (!syntheticType) {
            continue;
        }
        syntheticType = syntheticType!;

        let accountBalance: AccountBalance;
        if (!syntheticTypeToAccountBalanceMap.isSet(syntheticType)) {
            accountBalance = getOrCreateAccountBalance(account, syntheticType);
            accountBalance.totalDepositedUSD = BigInt.zero();
            syntheticTypeToAccountBalanceMap.set(syntheticType, accountBalance);
        } else { 
            accountBalance = syntheticTypeToAccountBalanceMap.get(syntheticType)!;
        }

        const strategy = getOrCreateStrategy(pool.poolAddress.toHexString(), pool.baseTokenAddress.toHexString());
        const strategyBalance = getOrCreateStrategyBalance(accountBalance, strategy);
        strategyBalance.amountDeposited = pool.userDepositedAmount;
        strategyBalance.amountDepositedUSD = pool.userDepositedValueUSD;
        accountBalance.totalDepositedUSD = accountBalance.totalDepositedUSD.plus(pool.userDepositedValueUSD);
        totalDepositedUSD = totalDepositedUSD.plus(pool.userDepositedValueUSD);

        strategy.save();
        strategyBalance.save();
    }

    for (let i = 0; i < poolsPageInfo.outstandingDebt.length; i++) {
        const outstandingDebt = poolsPageInfo.outstandingDebt[i];
        const contractDetails = ADDRESS_TO_CONTRACTS_MAP.get(outstandingDebt.savvyPositionManager.toHexString());
        if (!contractDetails) {
            continue;
        }
        let syntheticType = contractDetails.get("syntheticType");
        if (!syntheticType) {
            continue;
        }
        syntheticType = syntheticType!;
        const accountBalance = syntheticTypeToAccountBalanceMap.get(syntheticType);
        if (!accountBalance) {
            continue;
        }
        accountBalance.debt = outstandingDebt.amount;
        accountBalance.debtUSD = outstandingDebt.valueUSD;
        accountBalance.save();
        totalDebtUSD = totalDebtUSD.plus(outstandingDebt.valueUSD);
    }

    account.totalDebtUSD = totalDebtUSD;
    account.totalDepositedUSD = totalDepositedUSD;
    account.save();
}