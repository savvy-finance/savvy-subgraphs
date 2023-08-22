import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Account, SvySource } from "../../generated/schema";
import { veSVY } from "../../generated/veSVY/veSVY";
import { VE_SVY } from "../constants";
import { getSvyBalanceInUSD } from "../utils/tokens";
import { getOrCreateAccount } from "./account";
import { getOrCreateSvySource } from "./svySource";

export function receiveSVY(accountAddress: Address, svyReceived: BigInt, block: ethereum.Block): Account {
  const account = getOrCreateAccount(accountAddress);
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
  account.svyBalanceUSD = getSvyBalanceInUSD(account.svyBalance);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  return account;
}

export function updateVeSVYBalance(accountAddress: Address, block: ethereum.Block): Account {
  const account = getOrCreateAccount(accountAddress);
  account.veSVYBalance = veSVY.bind(Address.fromString(VE_SVY)).balanceOf(accountAddress);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();
  return account;
}

export function increaseTotalSvyDistributed(
  accountAddress: Address,
  svyAmount: BigInt,
  block: ethereum.Block
): SvySource {

  const svySource = getOrCreateSvySource(accountAddress);
  svySource.totalSvyDistributed = svySource.totalSvyDistributed.plus(svyAmount);
  svySource.lastUpdatedBN = block.number;
  svySource.lastUpdatedTimestamp = block.timestamp;
  svySource.save();
  return svySource;
}