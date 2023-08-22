import { Protocol } from "../../generated/schema";

const protocolId = "1";

export function getOrCreateProtocol(): Protocol {

  let protocol = Protocol.load(protocolId);
  if (protocol === null) {
    protocol = new Protocol(protocolId);
    protocol.totalSvyHolders = 0;
    protocol.totalVeSVYHolders = 0;
    protocol.save();
  }
  return protocol as Protocol;
}