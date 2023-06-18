import { ethereum, BigInt} from "@graphprotocol/graph-ts";
import { Account, AccountLiquiditySnapshot } from "../../generated/schema";
import { BIGINT_ZERO } from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";

export function getOrCreateAccount(address: string): Account {
    let account = Account.load(address);
    if (!account) {
        account = new Account(address);
        account.liquidityUSD = BIGINT_ZERO;
        account.lastUpdatedBN = BIGINT_ZERO;
        account.save();
    }
    return account;
}

export function updateAccount(block: ethereum.Block, address: string, changeInLiquidity: BigInt): Account {
    const account = getOrCreateAccount(address);
    account.liquidityUSD = account.liquidityUSD.plus(changeInLiquidity);
    account.lastUpdatedBN = block.number;
    account.save();
    return account;
}

export function createAccountLiquiditySnapshot(block: ethereum.Block, address: string, period: number): AccountLiquiditySnapshot {
    const account = getOrCreateAccount(address);
    
    const timestamp = getBeginOfThePeriodTimestamp(block.timestamp, period);
    const snapshotId = `${account.id}-${period}-${timestamp}`;
    let snapshot = AccountLiquiditySnapshot.load(snapshotId);
    if (!snapshot) {
        snapshot = new AccountLiquiditySnapshot(snapshotId);
        snapshot.account = account.id;
        snapshot.period = <i32>period;
        snapshot.timestamp = timestamp;
    }

    snapshot.liquidityUSD = account.liquidityUSD;

    snapshot.save();
    return snapshot;
}