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

  createBigIntArray(28, 29).map<void>((tokenId) => {
    const response = streamingHedgeysContract.streamBalanceOf(tokenId);
    if (response) {
      totalLockedSVY = totalLockedSVY.plus(response.getRemainder());
    }
  });

  createBigIntArray(5, 81).map<void>((planId: BigInt) => {
    const response = tokenLockupPlansContract.planBalanceOf(planId, timestamp, timestamp);
    if (response) {
      totalLockedSVY = totalLockedSVY.plus(response.getRemainder());
    }
  });

  createBigIntArray(6, 15).map<void>((planId: BigInt) => {
    const response = tokenVestingPlansContract.planBalanceOf(planId, timestamp, timestamp);
    if (response) {
      totalLockedSVY = totalLockedSVY.plus(response.getRemainder());
    }
  });

  MULTISIG_ADDRESSES.map<void>((multisigAddress: string) => {
    const svyBalance = SVYContract.balanceOf(Address.fromString(multisigAddress));
    if (svyBalance) {
      totalLockedSVY = totalLockedSVY.plus(svyBalance);
    }
  });

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