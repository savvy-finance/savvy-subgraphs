import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Account, LiquidityPool, Token } from "../../generated/schema";
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ONE,
  BIGINT_ZERO,
  TJ_LP_SVBTC,
  TJ_LP_SVBTC_CONTRACT,
  TJ_LP_SVETH,
  TJ_LP_SVETH_CONTRACT,
  TJ_LP_SVUSD,
  TJ_LP_SVUSD_CONTRACT,
  TJ_LP_SVY,
  TJ_LP_SVY_CONTRACT,
} from "../constants";
import { normalizeToTokenDecimals } from "../utils/tokens";
import { getLPPairInUSD } from "../utils/trader-joe";
import {
  getOrCreateAccountNFTPositions,
  syncAccountNFTPositions,
} from "./account-nft-positions";
import { createAccountSnapshot } from "./account-snapshot";
import { getOrCreateBin, refreshBinBalances } from "./bin";
import { getOrCreateLiquidityPool } from "./liquidity-pool";
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
    account.svy = BIGINT_ZERO;
    account.svyWETH = BIGINT_ZERO;
    account.svyBinIds = [];
    account.svyLiquidityUSD = BIGDECIMAL_ZERO;
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
    getOrCreateAccountNFTPositions(id);
    account.isEligibleForNFTBoost = false;
    account.nfts = id;
    account.save();
    syncAccountNFTPositions(account);
  }
  return account as Account;
}

export function updateBinIds(
  accountAddress: Address,
  pairAddress: Address,
  binIds: BigInt[]
): Account {
  const account = getOrCreateAccount(accountAddress);
  if (binIds.length === 0) {
    return account;
  }

  let binList: string[] = [];

  if (pairAddress.toHexString().includes(TJ_LP_SVY)) {
    binList = account.svyBinIds;
  } else if (pairAddress.toHexString().includes(TJ_LP_SVUSD)) {
    binList = account.svUSDBinIds;
  } else if (pairAddress.toHexString().includes(TJ_LP_SVETH)) {
    binList = account.svETHBinIds;
  } else if (pairAddress.toHexString().includes(TJ_LP_SVBTC)) {
    binList = account.svBTCBinIds;
  }

  for (let i = 0; i < binIds.length; i++) {
    const binId = binIds[i];
    const bin = getOrCreateBin(accountAddress, pairAddress, binId);

    if (!bin) {
      continue;
    }

    if (!binList.includes(bin.id)) {
      binList.push(bin.id);
    }
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVY)) {
    account.svyBinIds = binList;
  } else if (pairAddress.toHexString().includes(TJ_LP_SVUSD)) {
    account.svUSDBinIds = binList;
  } else if (pairAddress.toHexString().includes(TJ_LP_SVETH)) {
    account.svETHBinIds = binList;
  } else if (pairAddress.toHexString().includes(TJ_LP_SVBTC)) {
    account.svBTCBinIds = binList;
  }

  account.save();
  return account;
}

export function refreshBalances(
  accountAddress: Address,
  pairAddress: Address,
  blockNumber: BigInt,
  timestamp: BigInt
): Account {
  const account = getOrCreateAccount(accountAddress);

  const lp = getOrCreateLiquidityPool(pairAddress);
  let lbPairContract: LBPair;
  const pairedTokenAddress = Address.fromString(lp.pairToken);
  const pairedToken: Token = getOrCreateToken(pairedTokenAddress);
  let binIds: string[];
  let prunedBinIds: string[];
  let tokenXBalance = BIGINT_ZERO;
  let tokenYBalance = BIGINT_ZERO;
  if (
    pairAddress.toHexString().includes(TJ_LP_SVY) &&
    account.svyBinIds.length
  ) {
    lbPairContract = TJ_LP_SVY_CONTRACT;
    binIds = account.svyBinIds;
    prunedBinIds = [];
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPairContract,
        pairedToken.decimals,
        blockNumber
      );
      if (bin) {
        if (bin.tokenXBalance.isZero() && bin.tokenYBalance.isZero()) {
          continue;
        }

        tokenXBalance = tokenXBalance.plus(bin.tokenXBalance);
        tokenYBalance = tokenYBalance.plus(bin.tokenYBalance);
        prunedBinIds.push(binId);
      }
    }
    account.svyBinIds = prunedBinIds;
    account.svy = tokenXBalance;
    account.svyWETH = tokenYBalance;
    account.svyLiquidityUSD = getLPPairInUSD(
      lp.activeBinId,
      account.svy,
      pairedTokenAddress,
      normalizeToTokenDecimals(account.svyWETH, pairedToken.decimals),
      pairedToken.decimals
    );
  }

  if (
    pairAddress.toHexString().includes(TJ_LP_SVUSD) &&
    account.svUSDBinIds.length
  ) {
    lbPairContract = TJ_LP_SVUSD_CONTRACT;
    binIds = account.svUSDBinIds;
    prunedBinIds = [];
    tokenXBalance;
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPairContract,
        pairedToken.decimals,
        blockNumber
      );
      if (bin) {
        if (bin.tokenXBalance.isZero() && bin.tokenYBalance.isZero()) {
          continue;
        }

        tokenXBalance = tokenXBalance.plus(bin.tokenXBalance);
        tokenYBalance = tokenYBalance.plus(bin.tokenYBalance);
        prunedBinIds.push(binId);
      }
    }
    account.svUSDBinIds = prunedBinIds;
    account.svUSD = tokenXBalance;
    account.USDC = tokenYBalance;
    account.svUSDLiquidityUSD = getLPPairInUSD(
      lp.activeBinId,
      account.svUSD,
      pairedTokenAddress,
      normalizeToTokenDecimals(account.USDC, pairedToken.decimals),
      pairedToken.decimals
    );
  }

  if (
    pairAddress.toHexString().includes(TJ_LP_SVETH) &&
    account.svETHBinIds.length
  ) {
    lbPairContract = TJ_LP_SVETH_CONTRACT;
    binIds = account.svETHBinIds;
    prunedBinIds = [];
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPairContract,
        pairedToken.decimals,
        blockNumber
      );
      if (bin) {
        if (bin.tokenXBalance.isZero() && bin.tokenYBalance.isZero()) {
          continue;
        }

        tokenXBalance = tokenXBalance.plus(bin.tokenXBalance);
        tokenYBalance = tokenYBalance.plus(bin.tokenYBalance);
        prunedBinIds.push(binId);
      }
    }
    account.svETHBinIds = prunedBinIds;
    account.svETH = tokenXBalance;
    account.WETH = tokenYBalance;
    account.svETHLiquidityUSD = getLPPairInUSD(
      lp.activeBinId,
      account.svETH,
      pairedTokenAddress,
      normalizeToTokenDecimals(account.WETH, pairedToken.decimals),
      pairedToken.decimals
    );
  }

  if (
    pairAddress.toHexString().includes(TJ_LP_SVBTC) &&
    account.svBTCBinIds.length
  ) {
    lbPairContract = TJ_LP_SVBTC_CONTRACT;
    binIds = account.svBTCBinIds;
    prunedBinIds = [];
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPairContract,
        pairedToken.decimals,
        blockNumber
      );
      if (bin) {
        if (bin.tokenXBalance.isZero() && bin.tokenYBalance.isZero()) {
          continue;
        }

        tokenXBalance = tokenXBalance.plus(bin.tokenXBalance);
        tokenYBalance = tokenYBalance.plus(bin.tokenYBalance);
        prunedBinIds.push(binId);
      }
    }
    account.svBTCBinIds = prunedBinIds;
    account.svBTC = tokenXBalance;
    account.WBTC = tokenYBalance;
    account.svBTCLiquidityUSD = getLPPairInUSD(
      lp.activeBinId,
      account.svBTC,
      pairedTokenAddress,
      normalizeToTokenDecimals(account.WBTC, pairedToken.decimals),
      pairedToken.decimals
    );
  }
  account.totalLiquidityUSD = account.svyLiquidityUSD
    .plus(account.svUSDLiquidityUSD)
    .plus(account.svETHLiquidityUSD)
    .plus(account.svBTCLiquidityUSD);
  account.lastUpdatedBN = blockNumber;
  account.lastUpdatedTimestamp = timestamp;
  account.save();

  createAccountSnapshot(accountAddress, timestamp, account);
  return account;
}

export function refreshAllAccountBalances(
  pairAddress: Address,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  const protocol = getOrCreateProtocol();
  const accounts = protocol.accounts.load();
  const numOfAddresses = accounts.length;
  for (let i = 0; i < numOfAddresses; i++) {
    const address = Address.fromString(accounts[i].id);
    refreshBalances(address, pairAddress, blockNumber, timestamp);
  }
}
