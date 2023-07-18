import { ethereum } from "@graphprotocol/graph-ts";
import { LiquidityPool, Protocol } from "../../generated/schema";
import { BIGDECIMAL_ZERO, BIGINT_ZERO, PROTOCOL_NAME, PROTOCOL_SLUG, TJ_LP_SVBTC, TJ_LP_SVETH, TJ_LP_SVUSD } from "../constants";
import { createProtocolSnapshot } from "./protocol-snapshot";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.name = PROTOCOL_NAME;
    protocol.numOfAccounts = BIGINT_ZERO;
    protocol.svUSD = BIGINT_ZERO;
    protocol.USDC = BIGINT_ZERO;
    protocol.svUSDLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.svETH = BIGINT_ZERO;
    protocol.WETH = BIGINT_ZERO;
    protocol.svETHLiquidityUSD = BIGDECIMAL_ZERO;
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

export function updateProtocolPoolLiquidity(lbPair: LiquidityPool, block: ethereum.Block): Protocol {
  const protocol = getOrCreateProtocol();

  if (lbPair.id.includes(TJ_LP_SVUSD)) {
    protocol.svUSD = lbPair.savvySyntheticBalance;
    protocol.USDC = lbPair.pairTokenBalanceNormalized;
    protocol.svUSDLiquidityUSD = lbPair.totalValueUSD;
  }

  if (lbPair.id.includes(TJ_LP_SVETH)) {
    protocol.svETH = lbPair.savvySyntheticBalance;
    protocol.WETH = lbPair.pairTokenBalanceNormalized;
    protocol.svETHLiquidityUSD = lbPair.totalValueUSD;
  }

  if (lbPair.id.includes(TJ_LP_SVBTC)) {
    protocol.svBTC = lbPair.savvySyntheticBalance;
    protocol.WBTC = lbPair.pairTokenBalanceNormalized;
    protocol.svBTCLiquidityUSD = lbPair.totalValueUSD;
  }

  protocol.totalLiquidityUSD = protocol.svBTCLiquidityUSD.plus(protocol.svETHLiquidityUSD).plus(protocol.svUSDLiquidityUSD);
  protocol.lastUpdatedBN = lbPair.lastUpdatedBN;
  protocol.lastUpdatedTimestamp = lbPair.lastUpdatedTimestamp;
  protocol.save();
  createProtocolSnapshot(block, protocol);
  return protocol;
}