import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Account } from "../../generated/schema";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  ZERO_ADDRESS,
  veSVYContract
} from "../constants";
import { getFriendlyName } from "../utils/contracts";
import { getSvyBalanceInUSD } from "../utils/tokens";
import { createAccountSnapshot } from "./account-snapshot";
import {
  decrementSvyHolder,
  decrementVeSVYHolder,
  incrementSvyHolder,
  incrementVeSVYHolder
} from "./protocol";
import { increaseTotalSvyDistributed } from "./svySource";

export function getOrCreateAccount(address: Address): Account {
  const id = address.toHexString();
  let account = Account.load(id);
  if (account === null) {
    account = new Account(id);
    account.name = getFriendlyName(address);
    account.svyBalance = BIGINT_ZERO;
    account.svyBalanceUSD = BIGDECIMAL_ZERO;
    account.veSVYBalance = BIGINT_ZERO;
    account.lastUpdatedBN = BIGINT_ZERO;
    account.lastUpdatedTimestamp = BIGINT_ZERO;
    account.save();
  }
  return account as Account;
}

export function receiveSVY(accountAddress: Address, svyReceived: BigInt, block: ethereum.Block): void {
  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return;
  }
  const account = getOrCreateAccount(accountAddress);

  if (account.svyBalance.isZero()) {
    incrementSvyHolder(block);
  }

  account.svyBalance = account.svyBalance.plus(svyReceived);
  account.svyBalanceUSD = getSvyBalanceInUSD(account.svyBalance);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  createAccountSnapshot(accountAddress, block, account);
}

export function sendSVY(accountAddress: Address, svySent: BigInt, block: ethereum.Block): void {
  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return;
  }
  increaseTotalSvyDistributed(accountAddress, svySent, block);

  const account = getOrCreateAccount(accountAddress);
  account.svyBalance = account.svyBalance.minus(svySent);

  if (account.svyBalance.isZero()) {
    decrementSvyHolder(block);
  }

  account.svyBalanceUSD = getSvyBalanceInUSD(account.svyBalance);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  createAccountSnapshot(accountAddress, block, account);
}

export function updateVeSVYBalance(
  accountAddress: Address,
  updatedAmount: BigInt, // can be negative in case of Staked
  block: ethereum.Block
): void {

  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return;
  }
  const account = getOrCreateAccount(accountAddress);
  account.veSVYBalance = veSVYContract.balanceOf(accountAddress);

  if (account.veSVYBalance.isZero()) {
    decrementVeSVYHolder(block);
  }
  else if (account.veSVYBalance.equals(updatedAmount)) {
    incrementVeSVYHolder(block);
  }

  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  createAccountSnapshot(accountAddress, block, account);
}