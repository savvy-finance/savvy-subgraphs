import { ethereum } from "@graphprotocol/graph-ts";
import { Protocol, ProtocolSnapshot } from "../../generated/schema";
import {
  BIGINT_ZERO,
  PROTOCOL_SLUG,
  QUARTERHOUR_IN_SECONDS,
} from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { getOrCreateProtocol } from "./protocol";

export function getOrCreateProtocolSnapshot(
  block: ethereum.Block
): ProtocolSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(
    block.timestamp,
    QUARTERHOUR_IN_SECONDS
  );
  const id = PROTOCOL_SLUG.concat("-").concat(snapshot.toString());
  let protocolSnapshot = ProtocolSnapshot.load(id);
  if (!protocolSnapshot) {
    protocolSnapshot = new ProtocolSnapshot(id);
    protocolSnapshot.protocol = PROTOCOL_SLUG;
    protocolSnapshot.period = QUARTERHOUR_IN_SECONDS;
    protocolSnapshot.timestamp = snapshot;
    protocolSnapshot.circulatingSVY = BIGINT_ZERO;
    protocolSnapshot.save();
  }

  return protocolSnapshot;
}

export function createProtocolSnapshot(
  block: ethereum.Block,
  protocol: Protocol | null
): ProtocolSnapshot {
  const snapshot = getOrCreateProtocolSnapshot(block);
  if (!protocol) {
    protocol = getOrCreateProtocol();
  }
  snapshot.circulatingSVY = protocol.circulatingSVY;
  snapshot.timestamp = protocol.lastCirculatingSVYUpdatedTimestamp;
  snapshot.save();

  return snapshot;
}
