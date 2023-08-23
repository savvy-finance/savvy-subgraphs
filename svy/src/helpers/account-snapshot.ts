import { Address, ethereum } from "@graphprotocol/graph-ts";
import { Account, AccountSnapshot } from "../../generated/schema";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  QUARTERHOUR_IN_SECONDS
} from "../constants";
import { getFriendlyName } from "../utils/contracts";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { getOrCreateAccount } from "./account";

export function getOrCreateAccountSnapshot(accountAddress: Address, block: ethereum.Block): AccountSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(block.timestamp, QUARTERHOUR_IN_SECONDS);
  const id = accountAddress.toHexString().concat('-').concat(snapshot.toString());
  let accountSnapshot = AccountSnapshot.load(id);
  if (!accountSnapshot) {
    accountSnapshot = new AccountSnapshot(id);
    accountSnapshot.account = accountAddress.toHexString();
    accountSnapshot.name = getFriendlyName(accountAddress);
    accountSnapshot.period = QUARTERHOUR_IN_SECONDS;
    accountSnapshot.timestamp = snapshot;
    accountSnapshot.svyBalance = BIGINT_ZERO;
    accountSnapshot.svyBalanceUSD = BIGDECIMAL_ZERO;
    accountSnapshot.veSVYBalance = BIGINT_ZERO;
    accountSnapshot.stakedSVY = BIGINT_ZERO;
    accountSnapshot.save();
  }

  return accountSnapshot;
}

export function createAccountSnapshot(
  accountAddress: Address,
  block: ethereum.Block,
  account: Account | null
): AccountSnapshot {

  const snapshot = getOrCreateAccountSnapshot(accountAddress, block);
  if (!account) {
    account = getOrCreateAccount(accountAddress);
  }
  snapshot.svyBalance = account.svyBalance;
  snapshot.svyBalanceUSD = account.svyBalanceUSD;
  snapshot.veSVYBalance = account.veSVYBalance;
  snapshot.stakedSVY = account.stakedSVY;
  snapshot.save();

  return snapshot;
}