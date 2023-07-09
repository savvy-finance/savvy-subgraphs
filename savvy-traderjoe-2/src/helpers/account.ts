import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Account } from '../../generated/schema';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, TJ_LP_SVBTC, TJ_LP_SVETH, TJ_LP_SVUSD } from "../constants";
import { mergeSortedArrays, checkArrayIsAscSorted } from "../utils/array";

export function getOrCreateAccount(address: Address): Account {
  const id = address.toHexString();
  let account = Account.load(id);
  if (account === null) {
    account = new Account(id);
    account.svUSD = BIGINT_ZERO;
    account.USDC = BIGINT_ZERO;
    account.svUSDBinIds = [];
    account.svUSDLiquidityUSD = BIGDECIMAL_ZERO;
    account.svETH = BIGINT_ZERO;
    account.WETH = BIGINT_ZERO;
    account.svETHBinIds = [];
    account.svETHLiquidityUSD = BIGDECIMAL_ZERO;
    account.svBTC = BIGINT_ZERO;
    account.WBTC = BIGINT_ZERO;
    account.svBTCBinIds = [];
    account.svBTCLiquidityUSD = BIGDECIMAL_ZERO;
    account.totalLiquidityUSD = BIGDECIMAL_ZERO;
    account.lastUpdatedBN = BIGINT_ZERO;
    account.lastUpdatedTimestamp = BIGINT_ZERO;
    account.save();
  }
  return account as Account;
}

export function updateBinIds(accountAddress: Address, pairAddress: Address, binIds: BigInt[]): Account {
  log.debug("[updateBinIds] accountAddress {}, pairAddress '{}', tjUSD '{}', isUSD {}, binIds {}", [accountAddress.toHexString(), pairAddress.toHexString(), TJ_LP_SVUSD.toString(), (pairAddress.toHexString() === TJ_LP_SVUSD).toString(), binIds.toString()]);
  const account = getOrCreateAccount(accountAddress);
  if (binIds.length === 0) {
    log.debug("[updateBinIds] binIds.length === 0, return account {}", [account.id]);
    return account;
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVUSD)) {
    log.debug("[updateBinIds] account {}, account.svUSDBinIds {}, checkArrayIsAscSorted(binIds) {}", [account.id, account.svUSDBinIds.toString(), checkArrayIsAscSorted(binIds).toString()]);
    account.svUSDBinIds = mergeSortedArrays(account.svUSDBinIds, checkArrayIsAscSorted(binIds));
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVETH)) {
    account.svETHBinIds = mergeSortedArrays(account.svETHBinIds, checkArrayIsAscSorted(binIds));
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVBTC)) {
    account.svBTCBinIds = mergeSortedArrays(account.svBTCBinIds, checkArrayIsAscSorted(binIds));
  }
  
  account.save();
  return account;
}