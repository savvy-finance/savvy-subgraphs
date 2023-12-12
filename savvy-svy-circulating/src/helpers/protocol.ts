import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";
import {
  BIGINT_ZERO,
  HOUR_IN_SECONDS,
  MULTISIG_ADDRESSES,
  PROTOCOL_SLUG,
  SVYContract,
  TOTAL_SVY_SUPPLY,
  streamingHedgeysContract,
  tokenLockupPlansContract,
  tokenVestingPlansContract,
} from "../constants";
import { createBigIntArrayFromRange } from "../utils/base";
import { createProtocolSnapshot } from "./protocol-snapshot";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.circulatingSVY = BIGINT_ZERO;
    protocol.lastCirculatingSVYUpdatedTimestamp = BIGINT_ZERO;
    protocol.save();
  }
  return protocol as Protocol;
}

export function getCirculatingSVY(block: ethereum.Block): BigInt {
  const timestamp = block.timestamp;
  let totalLockedSVY = BIGINT_ZERO;

  /**
   * DEV: Closures (functions with a captured environment) are not yet supported.
   * Learn more: https://www.assemblyscript.org/status.html#on-closures
   */

  const streamingHedgeysTokenIds = createBigIntArrayFromRange(28, 29);
  for (let index = 0; index < streamingHedgeysTokenIds.length; index++) {
    const result = streamingHedgeysContract.try_streamBalanceOf(
      streamingHedgeysTokenIds[index]
    );
    if (result.reverted) continue;
    totalLockedSVY = totalLockedSVY.plus(result.value.getRemainder());
  }

  const tokenLockupPlanIds = createBigIntArrayFromRange(8, 77);
  for (let index = 0; index < tokenLockupPlanIds.length; index++) {
    const result = tokenLockupPlansContract.try_planBalanceOf(
      tokenLockupPlanIds[index],
      timestamp,
      timestamp
    );
    if (result.reverted) continue;
    totalLockedSVY = totalLockedSVY.plus(result.value.getRemainder());
  }

  const tokenVestingPlanIds = createBigIntArrayFromRange(6, 15);
  for (let index = 0; index < tokenVestingPlanIds.length; index++) {
    const result = tokenVestingPlansContract.try_planBalanceOf(
      tokenLockupPlanIds[index],
      timestamp,
      timestamp
    );
    if (result.reverted) continue;
    totalLockedSVY = totalLockedSVY.plus(result.value.getRemainder());
  }

  for (let index = 0; index < MULTISIG_ADDRESSES.length; index++) {
    totalLockedSVY = totalLockedSVY.plus(
      SVYContract.balanceOf(Address.fromString(MULTISIG_ADDRESSES[index]))
    );
  }

  return TOTAL_SVY_SUPPLY.minus(totalLockedSVY);
}

export function updateCirculatingSVY(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();

  const elapsedSeconds = block.timestamp
    .minus(protocol.lastCirculatingSVYUpdatedTimestamp)
    .toI32();
  if (elapsedSeconds > HOUR_IN_SECONDS / 2) {
    protocol.circulatingSVY = getCirculatingSVY(block);
    protocol.lastCirculatingSVYUpdatedTimestamp = block.timestamp;
    protocol.save();
    createProtocolSnapshot(block, protocol);
  }
}
