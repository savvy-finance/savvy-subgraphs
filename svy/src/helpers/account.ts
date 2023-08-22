import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Account } from "../../generated/schema";
import { BIGDECIMAL_ZERO, BIGINT_ZERO, veSVYContract } from "../constants";
import { getSvyBalanceInUSD } from "../utils/tokens";
import { getOrCreateProtocol } from "./protocol";

export function getOrCreateAccount(address: Address): Account {
  const id = address.toHexString();
  let account = Account.load(id);
  if (account === null) {
    account = new Account(id);
    account.svyBalance = BIGINT_ZERO;
    account.svyBalanceUSD = BIGDECIMAL_ZERO;
    account.veSVYBalance = BIGINT_ZERO;
    account.lastUpdatedBN = BIGINT_ZERO;
    account.lastUpdatedTimestamp = BIGINT_ZERO;
    account.save();
  }
  return account as Account;
}

export function receiveSVY(accountAddress: Address, svyReceived: BigInt, block: ethereum.Block): Account {
  const account = getOrCreateAccount(accountAddress);

  if (account.svyBalance.isZero()) {
    const protocol = getOrCreateProtocol();
    protocol.totalSvyHolders += 1;
    protocol.save();
  }

  account.svyBalance = account.svyBalance.plus(svyReceived);
  account.svyBalanceUSD = getSvyBalanceInUSD(account.svyBalance);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  return account;
}

export function sendSVY(accountAddress: Address, svySent: BigInt, block: ethereum.Block): Account {
  const account = getOrCreateAccount(accountAddress);
  account.svyBalance = account.svyBalance.minus(svySent);

  if (account.svyBalance.isZero()) {
    const protocol = getOrCreateProtocol();
    protocol.totalSvyHolders -= 1;
    protocol.save();
  }

  account.svyBalanceUSD = getSvyBalanceInUSD(account.svyBalance);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  return account;
}

export function updateVeSVYBalance(
  accountAddress: Address,
  updatedAmount: BigInt, // can be negative in case of Staked
  block: ethereum.Block
): Account {

  const account = getOrCreateAccount(accountAddress);
  account.veSVYBalance = veSVYContract.balanceOf(accountAddress);

  const protocol = getOrCreateProtocol();
  if (account.veSVYBalance.isZero()) {
    protocol.totalVeSVYHolders -= 1;
  }
  else if (account.veSVYBalance.equals(updatedAmount)) {
    protocol.totalVeSVYHolders += 1;
  }
  protocol.save();

  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  return account;
}