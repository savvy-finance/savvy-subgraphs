import { ethereum, BigInt} from "@graphprotocol/graph-ts";
import { Account, AccountLiquidity, AccountLiquiditySnapshot } from "../../generated/schema";
import { BIGINT_ZERO } from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";

export function getOrCreateAccount(address: string): Account {
    let account = Account.load(address);
    if (!account) {
        account = new Account(address);
        account.totalLiquidityUSD = BIGINT_ZERO;
        account.lastUpdatedBN = BIGINT_ZERO;
        account.save();
    }
    return account;
}

export function getOrCreateAccountLiquidity(address: string, pairAddress: string): AccountLiquidity {
    const id = `${address}-${pairAddress}`;
    let accountLiquidity = AccountLiquidity.load(id);
    if (!accountLiquidity) {
        accountLiquidity = new AccountLiquidity(id);
        accountLiquidity.account = address;
        accountLiquidity.liquidityUSD = BIGINT_ZERO;
        accountLiquidity.syntheticBalance = BIGINT_ZERO;
        accountLiquidity.baseTokenBalance = BIGINT_ZERO;
        accountLiquidity.lastUpdatedBN = BIGINT_ZERO;
        accountLiquidity.pairId = pairAddress;
        accountLiquidity.save();
    }
    return accountLiquidity;
}

export function updateAccountLiquidity(
    block: ethereum.Block,
    accountAdress: string, 
    pairAddress: string, 
    changeInSynthetic: BigInt,
    changeInBaseToken: BigInt,
    changeInLiquidity: BigInt
): void {
    const account = getOrCreateAccount(accountAdress);
    account.totalLiquidityUSD = account.totalLiquidityUSD.plus(changeInLiquidity);
    account.lastUpdatedBN = block.number;
    account.save();

    const accountLiquidity = getOrCreateAccountLiquidity(accountAdress, pairAddress);
    accountLiquidity.liquidityUSD = accountLiquidity.liquidityUSD.plus(changeInLiquidity);
    accountLiquidity.syntheticBalance = accountLiquidity.syntheticBalance.plus(changeInSynthetic);
    accountLiquidity.baseTokenBalance = accountLiquidity.baseTokenBalance.plus(changeInBaseToken);
    accountLiquidity.lastUpdatedBN = block.number;
    accountLiquidity.save();
}

export function createAccountLiquiditySnapshot(block: ethereum.Block, accountAddress: string, pairAddress: string, period: number): AccountLiquiditySnapshot {
    const accountLiquidity = getOrCreateAccountLiquidity(accountAddress, pairAddress);
    
    const timestamp = getBeginOfThePeriodTimestamp(block.timestamp, period);
    const snapshotId = `${accountLiquidity.id}-${<i32>period}-${timestamp}`;
    let snapshot = AccountLiquiditySnapshot.load(snapshotId);
    if (!snapshot) {
        snapshot = new AccountLiquiditySnapshot(snapshotId);
        snapshot.account = accountLiquidity.id;
        snapshot.period = <i32>period;
        snapshot.timestamp = timestamp;
    }

    snapshot.liquidityUSD = accountLiquidity.liquidityUSD;
    snapshot.syntheticBalance = accountLiquidity.syntheticBalance;
    snapshot.baseTokenBalance = accountLiquidity.baseTokenBalance;

    snapshot.save();
    return snapshot;
}