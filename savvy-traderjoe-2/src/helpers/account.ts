import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Account, Token } from "../../generated/schema";
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ONE,
  BIGINT_ZERO,
  TJ_LP_SVBTC,
  TJ_LP_SVETH,
  TJ_LP_SVUSD,
  TJ_LP_SVY,
} from "../constants";
import { normalizeToTokenDecimals } from "../utils/tokens";
import { getLPPairInUSD } from "../utils/trader-joe";
import {
  getOrCreateAccountNFTPositions,
  syncAccountNFTPositions,
} from "./account-nft-positions";
import { createAccountSnapshot } from "./account-snapshot";
import { getOrCreateBin, refreshBinBalances } from "./bin";
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
    log.debug("updateBinIds for svUSD - before ids: {}", [
      account.svUSDBinIds.toString(),
    ]);
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
    log.debug("updateBinIds for svUSD - after ids: {}", [
      account.svUSDBinIds.toString(),
    ]);
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

  let lbPair: LBPair;
  let pairedToken: Token;
  let binIds: string[];
  let tokenX: BigInt;
  let tokenY: BigInt;
  if (pairAddress.toHexString().includes(TJ_LP_SVY)) {
    lbPair = LBPair.bind(Address.fromString(TJ_LP_SVY));
    pairedToken = getOrCreateToken(lbPair.getTokenY());
    binIds = account.svyBinIds;
    tokenX = BIGINT_ZERO;
    tokenY = BIGINT_ZERO;
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPair,
        pairedToken.decimals
      );
      if (bin) {
        tokenX = tokenX.plus(bin.tokenXBalance);
        tokenY = tokenY.plus(bin.tokenYBalance);
      }
    }
    account.svy = tokenX;
    account.svyWETH = tokenY;
    account.svyLiquidityUSD = getLPPairInUSD(
      lbPair.getActiveId(),
      account.svy,
      lbPair.getTokenY(),
      normalizeToTokenDecimals(account.svyWETH, pairedToken.decimals),
      pairedToken.decimals
    );
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVUSD)) {
    lbPair = LBPair.bind(Address.fromString(TJ_LP_SVUSD));
    pairedToken = getOrCreateToken(lbPair.getTokenY());
    binIds = account.svUSDBinIds;
    tokenX = BIGINT_ZERO;
    tokenY = BIGINT_ZERO;
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPair,
        pairedToken.decimals
      );
      if (bin) {
        log.debug(
          "RAMSEY refreshAccount bin: {} tokenX: {} bin.tokenXBalance: {} tokenY: {} bin.tokenYBalance: {}",
          [
            bin.id,
            tokenX.toString(),
            bin.tokenXBalance.toString(),
            tokenY.toString(),
            bin.tokenYBalance.toString(),
          ]
        );
        tokenX = tokenX.plus(bin.tokenXBalance);
        tokenY = tokenY.plus(bin.tokenYBalance);
      } else {
        log.debug("RAMSEY refreshAccount bin: {} bin is null", [binId]);
      }
    }
    account.svUSD = tokenX;
    account.USDC = tokenY;
    log.debug("RAMSEY refreshAccount svUSD: {} usdc: {}", [
      tokenX.toString(),
      tokenY.toString(),
    ]);
    account.svUSDLiquidityUSD = getLPPairInUSD(
      lbPair.getActiveId(),
      account.svUSD,
      lbPair.getTokenY(),
      normalizeToTokenDecimals(account.USDC, pairedToken.decimals),
      pairedToken.decimals
    );
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVETH)) {
    lbPair = LBPair.bind(Address.fromString(TJ_LP_SVETH));
    pairedToken = getOrCreateToken(lbPair.getTokenY());
    binIds = account.svETHBinIds;
    tokenX = BIGINT_ZERO;
    tokenY = BIGINT_ZERO;
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPair,
        pairedToken.decimals
      );
      if (bin) {
        tokenX = tokenX.plus(bin.tokenXBalance);
        tokenY = tokenY.plus(bin.tokenYBalance);
      }
    }
    account.svETH = tokenX;
    account.WETH = tokenY;
    account.svETHLiquidityUSD = getLPPairInUSD(
      lbPair.getActiveId(),
      account.svETH,
      lbPair.getTokenY(),
      normalizeToTokenDecimals(account.WETH, pairedToken.decimals),
      pairedToken.decimals
    );
  }

  if (pairAddress.toHexString().includes(TJ_LP_SVBTC)) {
    lbPair = LBPair.bind(Address.fromString(TJ_LP_SVBTC));
    pairedToken = getOrCreateToken(lbPair.getTokenY());
    binIds = account.svBTCBinIds;
    tokenX = BIGINT_ZERO;
    tokenY = BIGINT_ZERO;
    for (let i = 0; i < binIds.length; i++) {
      const binId = binIds[i];
      const bin = refreshBinBalances(
        accountAddress,
        binId,
        lbPair,
        pairedToken.decimals
      );
      if (bin) {
        tokenX = tokenX.plus(bin.tokenXBalance);
        tokenY = tokenY.plus(bin.tokenYBalance);
      }
    }
    account.svBTC = tokenX;
    account.WBTC = tokenY;
    account.svBTCLiquidityUSD = getLPPairInUSD(
      lbPair.getActiveId(),
      account.svBTC,
      lbPair.getTokenY(),
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
