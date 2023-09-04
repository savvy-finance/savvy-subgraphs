import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  PROTOCOL_SLUG,
  QUARTERHOUR_IN_SECONDS,
} from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { Protocol, ProtocolSnapshot } from "../../generated/schema";
import { getOrCreateProtocol } from "./protocol";

export function getOrCreateProtocolSnapshot(
  timestamp: BigInt
): ProtocolSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(
    timestamp,
    QUARTERHOUR_IN_SECONDS
  );
  const id = PROTOCOL_SLUG.concat("-").concat(snapshot.toString());
  let protocolSnapshot = ProtocolSnapshot.load(id);
  if (protocolSnapshot === null) {
    protocolSnapshot = new ProtocolSnapshot(id);
    protocolSnapshot.period = QUARTERHOUR_IN_SECONDS;
    protocolSnapshot.timestamp = snapshot;
    protocolSnapshot.protocol = PROTOCOL_SLUG;
    protocolSnapshot.numOfAccounts = BIGINT_ZERO;
    protocolSnapshot.svyActiveBinId = 0;
    protocolSnapshot.svy = BIGINT_ZERO;
    protocolSnapshot.svyWETH = BIGINT_ZERO;
    protocolSnapshot.svyLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.svUSDActiveBinId = 0;
    protocolSnapshot.svUSD = BIGINT_ZERO;
    protocolSnapshot.USDC = BIGINT_ZERO;
    protocolSnapshot.svUSDLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.svETHActiveBinId = 0;
    protocolSnapshot.svETH = BIGINT_ZERO;
    protocolSnapshot.WETH = BIGINT_ZERO;
    protocolSnapshot.svETHLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.svBTCActiveBinId = 0;
    protocolSnapshot.svBTC = BIGINT_ZERO;
    protocolSnapshot.WBTC = BIGINT_ZERO;
    protocolSnapshot.svBTCLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.totalLiquidityUSD = BIGDECIMAL_ZERO;
    protocolSnapshot.save();
  }

  return protocolSnapshot;
}

export function createProtocolSnapshot(
  timestamp: BigInt,
  protocol: Protocol | null
): ProtocolSnapshot {
  if (!protocol) {
    protocol = getOrCreateProtocol();
  }

  const snapshot = getOrCreateProtocolSnapshot(timestamp);
  snapshot.numOfAccounts = protocol.numOfAccounts;
  snapshot.svyActiveBinId = protocol.svyActiveBinId;
  snapshot.svy = protocol.svy;
  snapshot.svyWETH = protocol.svyWETH;
  snapshot.svyLiquidityUSD = protocol.svyLiquidityUSD;
  snapshot.svUSDActiveBinId = protocol.svUSDActiveBinId;
  snapshot.svUSD = protocol.svUSD;
  snapshot.USDC = protocol.USDC;
  snapshot.svUSDLiquidityUSD = protocol.svUSDLiquidityUSD;
  snapshot.svETHActiveBinId = protocol.svETHActiveBinId;
  snapshot.svETH = protocol.svETH;
  snapshot.WETH = protocol.WETH;
  snapshot.svETHLiquidityUSD = protocol.svETHLiquidityUSD;
  snapshot.svBTCActiveBinId = protocol.svBTCActiveBinId;
  snapshot.svBTC = protocol.svBTC;
  snapshot.WBTC = protocol.WBTC;
  snapshot.svBTCLiquidityUSD = protocol.svBTCLiquidityUSD;
  snapshot.totalLiquidityUSD = protocol.totalLiquidityUSD;
  snapshot.save();

  return snapshot;
}
