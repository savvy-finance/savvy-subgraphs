import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import { LiquidityPool, LiquidityPoolSnapshot } from "../../generated/schema";
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import {
  BIGINT_ZERO,
  BIGDECIMAL_ZERO,
  QUARTERHOUR_IN_SECONDS,
} from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { normalizeToEighteenDecimals } from "../utils/tokens";
import { getOrCreateLiquidityPool } from "./liquidity-pool";

export function getOrCreateLiquidityPoolSnapshot(
  contractAddress: Address,
  timestamp: BigInt
): LiquidityPoolSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(
    timestamp,
    QUARTERHOUR_IN_SECONDS
  );
  const id = contractAddress
    .toHexString()
    .concat("-")
    .concat(snapshot.toString());
  let lpSnapshot = LiquidityPoolSnapshot.load(id);
  if (!lpSnapshot) {
    lpSnapshot = new LiquidityPoolSnapshot(id);
    lpSnapshot.liquidityPool = contractAddress.toHexString();
    lpSnapshot.activeBinId = 0;
    lpSnapshot.period = QUARTERHOUR_IN_SECONDS;
    lpSnapshot.savvySyntheticBalance = BIGINT_ZERO;
    lpSnapshot.pairTokenBalance = BIGINT_ZERO;
    lpSnapshot.pairTokenBalanceNormalized = BIGINT_ZERO;
    lpSnapshot.totalValueUSD = BIGDECIMAL_ZERO;
    lpSnapshot.timestamp = snapshot;
    lpSnapshot.save();
  }
  return lpSnapshot;
}

export function createLiquidityPoolSnapshot(
  contractAddress: Address,
  timestamp: BigInt,
  lp: LiquidityPool | null
): LiquidityPoolSnapshot {
  const snapshot = getOrCreateLiquidityPoolSnapshot(contractAddress, timestamp);
  if (lp === null) {
    lp = getOrCreateLiquidityPool(contractAddress);
  }
  snapshot.activeBinId = lp.activeBinId;
  snapshot.savvySyntheticBalance = lp.savvySyntheticBalance;
  snapshot.pairTokenBalance = lp.pairTokenBalance;
  snapshot.pairTokenBalanceNormalized = lp.pairTokenBalanceNormalized;
  snapshot.totalValueUSD = lp.totalValueUSD;
  snapshot.save();

  return snapshot;
}
