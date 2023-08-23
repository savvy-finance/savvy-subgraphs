import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Account } from "../../generated/schema";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  ZERO_ADDRESS,
  veSVYContract
} from "../constants";
import { getSVYBalanceInUSD } from "../utils/tokens";
import { createAccountSnapshot } from "./account-snapshot";
import {
  decrementSVYHolder,
  decrementSVYStaker,
  decrementVeSVYHolder,
  incrementSVYHolder,
  incrementSVYStaker,
  incrementVeSVYHolder
} from "./protocol";
import { increaseTotalSVYDistributed } from "./svySource";

export function getOrCreateAccount(address: Address): Account {
  const id = address.toHexString();
  let account = Account.load(id);
  if (account === null) {
    account = new Account(id);
    account.svyBalance = BIGINT_ZERO;
    account.svyBalanceUSD = BIGDECIMAL_ZERO;
    account.veSVYBalance = BIGINT_ZERO;
    account.stakedSVY = BIGINT_ZERO;
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

  // Account
  const account = getOrCreateAccount(accountAddress);
  account.svyBalance = account.svyBalance.plus(svyReceived);
  account.svyBalanceUSD = getSVYBalanceInUSD(account.svyBalance);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();

  // Protocol
  if (account.svyBalance.isZero()) {
    incrementSVYHolder(block);
  }

  // AccountSnapshot
  createAccountSnapshot(accountAddress, block, account);
}

export function sendSVY(accountAddress: Address, svySent: BigInt, block: ethereum.Block): void {
  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return;
  }

  // Account
  const account = getOrCreateAccount(accountAddress);
  account.svyBalance = account.svyBalance.minus(svySent);
  account.svyBalanceUSD = getSVYBalanceInUSD(account.svyBalance);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();

  // Protocol
  if (account.svyBalance.isZero()) {
    decrementSVYHolder(block);
  }

  // SVYSource
  increaseTotalSVYDistributed(accountAddress, svySent, block);

  // AccountSnapshot
  createAccountSnapshot(accountAddress, block, account);
}

export function updateStakedSVYBalance(
  accountAddress: Address,
  amount: BigInt,
  block: ethereum.Block
): Account | null {
  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return null;
  }

  // Account
  const account = getOrCreateAccount(accountAddress);
  const oldStakedSVYBalance = account.stakedSVY;
  account.stakedSVY = account.stakedSVY.plus(amount);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();

  // Protocol
  if (account.stakedSVY.isZero()) {
    decrementSVYStaker(block);
  } else if (oldStakedSVYBalance.isZero() && !account.stakedSVY.isZero()) {
    incrementSVYStaker(block);
  }

  // AccountSnapshot is created by updateVeSVYBalance
  return updateVeSVYBalance(accountAddress, block, account);
}


export function updateVeSVYBalance(
  accountAddress: Address,
  block: ethereum.Block,
  account: Account | null
): Account | null {
  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return null;
  }

  // Account
  if (!account) {
    account = getOrCreateAccount(accountAddress);
  }
  const oldVeSVYBalance = account.veSVYBalance;
  account.veSVYBalance = veSVYContract.balanceOf(accountAddress);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();

  // Protocol
  if (account.veSVYBalance.isZero()) {
    decrementVeSVYHolder(block);
  } else if (oldVeSVYBalance.isZero() && !account.veSVYBalance.isZero()) {
    incrementVeSVYHolder(block);
  }

  // AccountSnapshot
  createAccountSnapshot(accountAddress, block, account);

  return account;
}