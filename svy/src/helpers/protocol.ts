import { Protocol } from "../../generated/schema";
import { PROTOCOL_SLUG } from "../constants";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.totalSvyHolders = 0;
    protocol.totalVeSVYHolders = 0;
    protocol.save();
  }
  return protocol as Protocol;
}

export function incrementSvyHolder() {
  const protocol = getOrCreateProtocol();
  protocol.totalSvyHolders += 1;
  protocol.save();
}

export function decrementSvyHolder() {
  const protocol = getOrCreateProtocol();
  protocol.totalSvyHolders -= 1;
  protocol.save();
}

export function incrementVeSVYHolder() {
  const protocol = getOrCreateProtocol();
  protocol.totalVeSVYHolders += 1;
  protocol.save();
}

export function decrementVeSVYHolder() {
  const protocol = getOrCreateProtocol();
  protocol.totalVeSVYHolders -= 1;
  protocol.save();
}
