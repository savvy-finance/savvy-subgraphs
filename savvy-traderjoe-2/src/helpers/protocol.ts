import { Protocol } from "../../generated/schema";
import { BIGDECIMAL_ZERO, BIGINT_ZERO, PROTOCOL_NAME, PROTOCOL_SLUG } from "../constants";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.name = PROTOCOL_NAME;
    protocol.numOfAccounts = BIGINT_ZERO;
    protocol.svUSDLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.svETHLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.svBTCLiquidityUSD = BIGDECIMAL_ZERO;
    protocol.save();
  }

  return protocol;
}