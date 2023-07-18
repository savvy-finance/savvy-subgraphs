import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { Account } from '../../generated/schema';
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import { BIGDECIMAL_ZERO, BIGINT_ONE, BIGINT_ZERO, TJ_LP_SVBTC, TJ_LP_SVETH, TJ_LP_SVUSD } from "../constants";
import { mergeSortedArrays, checkArrayIsAscSorted } from "../utils/array";
import { normalizeToEighteenDecimals } from "../utils/tokens";
import { getBalancesFromBinIds, getLPPairInUSD } from "../utils/trader-joe";
import { createAccountSnapshot } from "./account-snapshot";
import { getOrCreateProtocol } from "./protocol";
import { getOrCreateToken } from "./token";

export function getOrCreateAccount(address: Address): Account {
  const id = address.toHexString();
  let account = Account.load(id);
  if (account === null) {
    account = new Account(id);
    const protocol = getOrCreateProtocol();
    protocol.numOfAccounts = protocol.numOfAccounts.plus(BIGINT_ONE);
    protocol.save();
    account.protocol = protocol.id;
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
  const account = getOrCreateAccount(accountAddress);
  if (binIds.length === 0) {
    return account;
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVUSD)) {
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

export function refreshBalances(accountAddress: Address, block: ethereum.Block): Account {
  const account = getOrCreateAccount(accountAddress);

  let lbPair = LBPair.bind(Address.fromString(TJ_LP_SVUSD));
  let pairedToken = getOrCreateToken(lbPair.getTokenY());
  let balances = getBalancesFromBinIds(accountAddress, lbPair._address, account.svUSDBinIds);
  account.svUSD = balances[0];
  account.USDC = normalizeToEighteenDecimals(balances[1], pairedToken.decimals);
  account.svUSDLiquidityUSD = getLPPairInUSD(
    lbPair.getActiveId(), 
    balances[0], 
    lbPair.getTokenY(),
    balances[1],
    pairedToken.decimals
  );

  lbPair = LBPair.bind(Address.fromString(TJ_LP_SVETH));
  pairedToken = getOrCreateToken(lbPair.getTokenY());
  balances = getBalancesFromBinIds(accountAddress, lbPair._address, account.svETHBinIds);
  account.svETH = balances[0];
  account.WETH = normalizeToEighteenDecimals(balances[1], pairedToken.decimals);
  account.svETHLiquidityUSD = getLPPairInUSD(
    lbPair.getActiveId(), 
    balances[0], 
    lbPair.getTokenY(),
    balances[1],
    pairedToken.decimals
  );

  lbPair = LBPair.bind(Address.fromString(TJ_LP_SVBTC));
  pairedToken = getOrCreateToken(lbPair.getTokenY());
  balances = getBalancesFromBinIds(accountAddress, lbPair._address, account.svBTCBinIds);
  account.svBTC = balances[0];
  account.WBTC = normalizeToEighteenDecimals(balances[1], pairedToken.decimals);
  account.svBTCLiquidityUSD = getLPPairInUSD(
    lbPair.getActiveId(), 
    balances[0], 
    lbPair.getTokenY(),
    balances[1],
    pairedToken.decimals
  );

  account.totalLiquidityUSD = account.svUSDLiquidityUSD.plus(account.svETHLiquidityUSD).plus(account.svBTCLiquidityUSD);
  account.lastUpdatedBN = block.number;
  account.lastUpdatedTimestamp = block.timestamp;
  account.save();

  createAccountSnapshot(accountAddress, block, account);
  return account;
}

export function refreshAllAccountBalances(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  const accounts = protocol.accounts.load();
  const numOfAddresses = accounts.length;
  for (let i = 0; i < numOfAddresses; i++) {
    const address = Address.fromString(accounts[i].id);
    refreshBalances(address, block);
  }
}