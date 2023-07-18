import { ethereum } from "@graphprotocol/graph-ts";
import { BIGDECIMAL_ZERO, BIGINT_ZERO, PROTOCOL_SLUG, QUARTERHOUR_IN_SECONDS } from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { Protocol, ProtocolSnapshot } from "../../generated/schema";
import { getOrCreateProtocol } from "./protocol";

export function getOrCreateProtocolSnapshot(block: ethereum.Block): ProtocolSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(block.timestamp, QUARTERHOUR_IN_SECONDS);
  const id = PROTOCOL_SLUG.concat('-').concat(snapshot.toString());
  let protocolSnapshot = ProtocolSnapshot.load(id);
  if (protocolSnapshot === null) {
    protocolSnapshot = new ProtocolSnapshot(id);
    protocolSnapshot.period = QUARTERHOUR_IN_SECONDS;
    protocolSnapshot.timestamp = snapshot;
    protocolSnapshot.protocol = PROTOCOL_SLUG;
    protocolSnapshot.numOfAccounts = BIGINT_ZERO;
    protocolSnapshot.svUSD = BIGINT_ZERO;
    protocolSnapshot.USDC = BIGINT_ZERO;
    protocolSnapshot.svUSDLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.svETH = BIGINT_ZERO;
    protocolSnapshot.WETH = BIGINT_ZERO;
    protocolSnapshot.svETHLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.svBTC = BIGINT_ZERO;
    protocolSnapshot.WBTC = BIGINT_ZERO;
    protocolSnapshot.svBTCLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.totalLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.save();
  }

  return protocolSnapshot;
}

export function createProtocolSnapshot(block: ethereum.Block, protocol: Protocol | null): ProtocolSnapshot {
  if (!protocol) {
    protocol = getOrCreateProtocol();
  }
  
  const snapshot = getOrCreateProtocolSnapshot(block);
  snapshot.numOfAccounts = protocol.numOfAccounts;
  snapshot.svUSD = protocol.svUSD;
  snapshot.USDC = protocol.USDC;
  snapshot.svUSDLiquidityUSD = protocol.svUSDLiquidityUSD;
  snapshot.svETH = protocol.svETH;
  snapshot.WETH = protocol.WETH;
  snapshot.svETHLiquidityUSD = protocol.svETHLiquidityUSD;
  snapshot.svBTC = protocol.svBTC;
  snapshot.WBTC = protocol.WBTC;
  snapshot.svBTCLiquidityUSD = protocol.svBTCLiquidityUSD;
  snapshot.totalLiquidityUSD = protocol.totalLiquidityUSD;
  snapshot.save();

  return snapshot;
}