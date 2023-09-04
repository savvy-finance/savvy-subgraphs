import { ethereum } from "@graphprotocol/graph-ts";
import { LiquidityPool, Protocol } from "../../generated/schema";
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  PROTOCOL_NAME,
  PROTOCOL_SLUG,
  TJ_LP_SVBTC,
  TJ_LP_SVETH,
  TJ_LP_SVUSD,
  TJ_LP_SVY,
} from "../constants";
import { createProtocolSnapshot } from "./protocol-snapshot";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.name = PROTOCOL_NAME;
    protocol.numOfAccounts = BIGINT_ZERO;
    protocol.svyActiveBinId = 0;
    protocol.svy = BIGINT_ZERO;
    protocol.svyWETH = BIGINT_ZERO;
    protocol.svyLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.svUSDActiveBinId = 0;
    protocol.svUSD = BIGINT_ZERO;
    protocol.USDC = BIGINT_ZERO;
    protocol.svUSDLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.svETHActiveBinId = 0;
    protocol.svETH = BIGINT_ZERO;
    protocol.WETH = BIGINT_ZERO;
    protocol.svETHLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.svBTCActiveBinId = 0;
    protocol.svBTC = BIGINT_ZERO;
    protocol.WBTC = BIGINT_ZERO;
    protocol.svBTCLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.totalLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.lastUpdatedBN = BIGINT_ZERO;
    protocol.lastUpdatedTimestamp = BIGINT_ZERO;
    protocol.save();
  }

  return protocol;
}

export function updateProtocolPoolLiquidity(lbPair: LiquidityPool): Protocol {
  const protocol = getOrCreateProtocol();

  if (lbPair.id.includes(TJ_LP_SVY)) {
    protocol.svyActiveBinId = lbPair.activeBinId;
    protocol.svy = lbPair.savvySyntheticBalance;
    protocol.svyWETH = lbPair.pairTokenBalanceNormalized;
    protocol.svyLiquidityUSD = lbPair.totalValueUSD;
  }

  if (lbPair.id.includes(TJ_LP_SVUSD)) {
    protocol.svUSDActiveBinId = lbPair.activeBinId;
    protocol.svUSD = lbPair.savvySyntheticBalance;
    protocol.USDC = lbPair.pairTokenBalanceNormalized;
    protocol.svUSDLiquidityUSD = lbPair.totalValueUSD;
  }

  if (lbPair.id.includes(TJ_LP_SVETH)) {
    protocol.svETHActiveBinId = lbPair.activeBinId;
    protocol.svETH = lbPair.savvySyntheticBalance;
    protocol.WETH = lbPair.pairTokenBalanceNormalized;
    protocol.svETHLiquidityUSD = lbPair.totalValueUSD;
  }

  if (lbPair.id.includes(TJ_LP_SVBTC)) {
    protocol.svBTCActiveBinId = lbPair.activeBinId;
    protocol.svBTC = lbPair.savvySyntheticBalance;
    protocol.WBTC = lbPair.pairTokenBalanceNormalized;
    protocol.svBTCLiquidityUSD = lbPair.totalValueUSD;
  }

  protocol.totalLiquidityUSD = protocol.svBTCLiquidityUSD
    .plus(protocol.svETHLiquidityUSD)
    .plus(protocol.svUSDLiquidityUSD);
  protocol.lastUpdatedBN = lbPair.lastUpdatedBN;
  protocol.lastUpdatedTimestamp = lbPair.lastUpdatedTimestamp;
  protocol.save();
  createProtocolSnapshot(protocol.lastUpdatedTimestamp, protocol);
  return protocol;
}
