import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
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
  tokenVestingPlansContract
} from "../constants";
import { createBigIntArray } from "../utils/base";
import { createProtocolSnapshot } from "./protocol-snapshot";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.totalSVYHolders = 0;
    protocol.totalSVYStakers = 0;
    protocol.totalVeSVYHolders = 0;
    protocol.circulatingSVY = BIGINT_ZERO;
    protocol.lastCirculatingSVYUpdatedTimestamp = BIGINT_ZERO;
    protocol.save();
  }
  return protocol as Protocol;
}

export function incrementSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYHolders += 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function decrementSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYHolders -= 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function incrementSVYStaker(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYStakers += 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function decrementSVYStaker(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYStakers -= 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function incrementVeSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalVeSVYHolders += 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function decrementVeSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalVeSVYHolders -= 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function getCirculatingSVY(block: ethereum.Block): BigInt {
  const timestamp = block.timestamp;
  let totalLockedSVY = BIGINT_ZERO;

  /**
   * DEV: Closures (functions with a captured environment) are not yet supported.
   * Learn more: https://www.assemblyscript.org/status.html#on-closures
   */

  const streamingHedgeysTokenIds = createBigIntArray(28, 29);
  for (let index = 0; index < streamingHedgeysTokenIds.length; index++) {
    totalLockedSVY = totalLockedSVY.plus(
      streamingHedgeysContract.streamBalanceOf(streamingHedgeysTokenIds[index]).getRemainder()
    );
  };

  const tokenLockupPlansPlanIds = createBigIntArray(5, 81);
  for (let index = 0; index < tokenLockupPlansPlanIds.length; index++) {
    totalLockedSVY = totalLockedSVY.plus(
      tokenLockupPlansContract.planBalanceOf(
        tokenLockupPlansPlanIds[index], timestamp, timestamp
      ).getRemainder()
    );
  };

  const tokenVestingPlansPlanIds = createBigIntArray(6, 15);
  for (let index = 0; index < tokenVestingPlansPlanIds.length; index++) {
    totalLockedSVY = totalLockedSVY.plus(
      tokenVestingPlansContract.planBalanceOf(
        tokenVestingPlansPlanIds[index], timestamp, timestamp
      ).getRemainder()
    );
  };

  for (let index = 0; index < MULTISIG_ADDRESSES.length; index++) {
    totalLockedSVY = totalLockedSVY.plus(
      SVYContract.balanceOf(
        Address.fromString(MULTISIG_ADDRESSES[index])
      )
    );
  };

  return TOTAL_SVY_SUPPLY.minus(totalLockedSVY);
}

export function updateCirculatingSVY(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();

  const elapsedSeconds = block.timestamp.minus(protocol.lastCirculatingSVYUpdatedTimestamp).toI32();
  if (elapsedSeconds > HOUR_IN_SECONDS / 2) {
    protocol.circulatingSVY = getCirculatingSVY(block);
    protocol.lastCirculatingSVYUpdatedTimestamp = block.timestamp;
    protocol.save();
    createProtocolSnapshot(block, protocol);
  }
}