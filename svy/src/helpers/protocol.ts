import { ethereum } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";
import { PROTOCOL_SLUG } from "../constants";
import { createProtocolSnapshot } from "./protocol-snapshot";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.totalSVYHolders = 0;
    protocol.totalVeSVYHolders = 0;
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
