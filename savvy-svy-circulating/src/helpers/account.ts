import {
  ethereum,
  Address,
  BigInt,
  Bytes,
  log,
  TypedMap,
} from "@graphprotocol/graph-ts";
import { Account, AccountSnapshot } from "../../generated/schema";

export function getOrCreateAccount(address: string): Account {
  let account = Account.load(address);
  if (!account) {
    account = new Account(address);
    account.lastUpdatedTimestamp = BigInt.zero();
    account.stakedSVY = BigInt.zero();
    account.svyAmount = BigInt.zero();
    account.save();
  }
  return account;
}
export function copyAccountSnapshotFromAccount(
  account: Account,
  timestamp: BigInt
): AccountSnapshot {
  let accountSnapshot = AccountSnapshot.load(`${account.id}-${timestamp}`);
  if (!accountSnapshot) {
    accountSnapshot = new AccountSnapshot(`${account.id}-${timestamp}`);
  }
  accountSnapshot.stakedSVY = account.stakedSVY;
  accountSnapshot.svyAmount = account.svyAmount;
  accountSnapshot.timestamp = timestamp;
  accountSnapshot.period = account.lastUpdatedTimestamp.equals(BigInt.zero())
    ? timestamp.minus(account.lastUpdatedTimestamp)
    : BigInt.zero();
  accountSnapshot.save();
  return accountSnapshot;
}

export function syncUserPosition(
  accountAddress: Address,
  event: ethereum.Event
): Account {
  // getSavvyDeFiOrCreate();
  const account = getOrCreateAccount(accountAddress.toHexString());

  copyAccountSnapshotFromAccount(account, event.block.timestamp);
  account.lastUpdatedTimestamp = event.block.timestamp;
  account.save();
  return account;
}
