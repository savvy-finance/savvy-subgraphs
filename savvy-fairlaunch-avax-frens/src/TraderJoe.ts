import { Transfer as TransferEventJOE } from "../generated/JOE/JOEToken";
import { Transfer as TransferEventTJAVAXUSDC } from "../generated/TJAVAXUSDC/TJAVAXUSDCToken";
import { Transfer as TransferEventTJBTCbAVAX } from "../generated/TJBTCbAVAX/TJBTCbAVAXToken";
import { Transfer as TransferEventTJJOEAVAX } from "../generated/TJJOEAVAX/TJJOEAVAXToken";
import { getUser } from "./utils";

export function handleTransferJOE(event: TransferEventJOE): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldJOE = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJAVAXUSDC(event: TransferEventTJAVAXUSDC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJAVAXUSDC = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJBTCbAVAX(event: TransferEventTJBTCbAVAX): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJBTCbAVAX = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJJOEAVAX(event: TransferEventTJJOEAVAX): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJJOEAVAX = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}