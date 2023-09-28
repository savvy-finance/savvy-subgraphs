import { Address, BigInt, Bytes, log, TypedMap } from "@graphprotocol/graph-ts";
import {
  Account,
  AccountBalance,
  Strategy,
  StrategyBalance,
} from "../../generated/schema";
import { SavvyFrontendInfoAggregator as SavvyFrontendInfoAggregatorContract } from "../../generated/SavvyPositionManagerUSD/SavvyFrontendInfoAggregator";
import { addUniqueUser, getSavvyDeFiOrCreate } from "./savvyDeFi";
import { ADDRESS_TO_CONTRACTS_MAP } from "./config/aribtrumGoerli";

export function getOrCreateAccount(address: string): Account {
  let account = Account.load(address);
  if (!account) {
    account = new Account(address);
    account.totalDepositedUSD = BigInt.zero();
    account.totalDebtUSD = BigInt.zero();
    account.save();
    addUniqueUser();
  }
  return account;
}

export function getAccountBalanceId(
  account: Account,
  syntheticType: string
): string {
  return `${account.id}-${syntheticType}`;
}
export function getOrCreateAccountBalance(
  account: Account,
  syntheticType: string
): AccountBalance {
  const id = getAccountBalanceId(account, syntheticType);
  let accountBalance = AccountBalance.load(id);
  if (!accountBalance) {
    accountBalance = new AccountBalance(id);
    accountBalance.account = account.id;
    accountBalance.syntheticType = syntheticType;
    accountBalance.debt = BigInt.zero();
    accountBalance.debtUSD = BigInt.zero();
    accountBalance.totalDepositedUSD = BigInt.zero();
    accountBalance.save();
  }
  return accountBalance;
}

export function getOrCreateStrategy(
  strategyAddress: string,
  baseTokenAddress?: string
): Strategy {
  let strategy = Strategy.load(strategyAddress);
  if (!strategy) {
    strategy = new Strategy(strategyAddress);
    if (!baseTokenAddress) {
      baseTokenAddress = "";
    }
    strategy.baseTokenAddress = Bytes.fromHexString(baseTokenAddress);
    strategy.save();
  }
  return strategy;
}

export function getStrategyBalanceId(
  accountBalance: AccountBalance,
  strategy: Strategy
): string {
  return `${accountBalance.id}-${strategy.id}`;
}
export function getOrCreateStrategyBalance(
  accountBalance: AccountBalance,
  strategy: Strategy
): StrategyBalance {
  const id = getStrategyBalanceId(accountBalance, strategy);
  let strategyBalance = StrategyBalance.load(id);
  if (!strategyBalance) {
    strategyBalance = new StrategyBalance(id);
    strategyBalance.accountBalance = accountBalance.id;
    strategyBalance.strategy = strategy.id;
    strategyBalance.amountDeposited = BigInt.zero();
    strategyBalance.amountDepositedUSD = BigInt.zero();
    strategyBalance.save();
  }
  return strategyBalance;
}

export function syncUserPosition(accountAddress: Address): Account {
  getSavvyDeFiOrCreate();
  const account = getOrCreateAccount(accountAddress.toHexString());
  const savvyFrontendInfoAggregator = SavvyFrontendInfoAggregatorContract.bind(
    Address.fromString("0x3056aa8a7e85ba9eb36b6af8b98d3a28024b7d94")
  );

  if (!savvyFrontendInfoAggregator) {
    return account;
  }

  const poolsPageInfoResult =
    savvyFrontendInfoAggregator.try_getPoolsPageInfo(accountAddress);
  if (poolsPageInfoResult.reverted) {
    log.warning("Failed to load pools page for account={}", [
      accountAddress.toHexString(),
    ]);
    return account;
  }
  const poolsPageInfo = poolsPageInfoResult.value;

  let totalDepositedUSD = BigInt.zero();
  let totalDebtUSD = BigInt.zero();
  const syntheticTypeToAccountBalanceMap = new TypedMap<
    string,
    AccountBalance
  >();
  for (let i = 0; i < poolsPageInfo.pools.length; i++) {
    const pool = poolsPageInfo.pools[i];
    const savvyPositionManagerAddress = pool.savvyPositionManager.toHexString();
    const contractDetails = ADDRESS_TO_CONTRACTS_MAP.get(
      savvyPositionManagerAddress
    );
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

    const strategy = getOrCreateStrategy(
      pool.poolAddress.toHexString(),
      pool.baseTokenAddress.toHexString()
    );
    const strategyBalance = getOrCreateStrategyBalance(
      accountBalance,
      strategy
    );
    strategyBalance.amountDeposited = pool.userDepositedAmount;
    strategyBalance.amountDepositedUSD = pool.userDepositedValueUSD;
    accountBalance.totalDepositedUSD = accountBalance.totalDepositedUSD.plus(
      pool.userDepositedValueUSD
    );
    totalDepositedUSD = totalDepositedUSD.plus(pool.userDepositedValueUSD);

    strategy.save();
    strategyBalance.save();
  }

  for (let i = 0; i < poolsPageInfo.outstandingDebt.length; i++) {
    const outstandingDebt = poolsPageInfo.outstandingDebt[i];
    const contractDetails = ADDRESS_TO_CONTRACTS_MAP.get(
      outstandingDebt.savvyPositionManager.toHexString()
    );
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
  return account;
}
