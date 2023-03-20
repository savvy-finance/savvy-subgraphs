import { Transfer as TransferEventJOE } from "../generated/JOE/JOEToken";
import { Transfer as TransferEventTJAVAXUSDC } from "../generated/TJAVAXUSDC/TJAVAXUSDCToken";
import { Transfer as TransferEventTJBTCbAVAX } from "../generated/TJBTCbAVAX/TJBTCbAVAXToken";
import { Transfer as TransferEventTJJOEAVAX } from "../generated/TJJOEAVAX/TJJOEAVAXToken";
import { Transfer as TransferEventTJWBTCeBTCb } from "../generated/TJWBTCeBTCb/TJWBTCeBTCbToken";
import { Transfer as TransferEventTJAVAXUSDT } from "../generated/TJAVAXUSDT/TJAVAXUSDTToken";
import { Transfer as TransferEventTJUSDTUSDC } from "../generated/TJUSDTUSDC/TJUSDTUSDCToken";
import { Transfer as TransferEventTJUSDCeUSDC } from "../generated/TJUSDCeUSDC/TJUSDCeUSDCToken";
import { Transfer as TransferEventTJUSDTeUSDT } from "../generated/TJUSDTeUSDT/TJUSDTeUSDTToken";
import { Transfer as TransferEventTJBTCbUSDC } from "../generated/TJBTCbUSDC/TJBTCbUSDCToken";
import { Transfer as TransferEventTJDAIeUSDC } from "../generated/TJDAIeUSDC/TJDAIeUSDCToken";
import { Transfer as TransferEventTJsAVAXAVAX } from "../generated/TJsAVAXAVAX/TJsAVAXAVAXToken";
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

export function handleTransferTJWBTCeBTCb(event: TransferEventTJWBTCeBTCb): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJWBTCeBTCb = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJAVAXUSDT(event: TransferEventTJAVAXUSDT): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJAVAXUSDT = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJUSDTUSDC(event: TransferEventTJUSDTUSDC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJUSDTUSDC = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJUSDCeUSDC(event: TransferEventTJUSDCeUSDC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJUSDCeUSDC = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJUSDTeUSDT(event: TransferEventTJUSDTeUSDT): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJUSDTeUSDT = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJBTCbUSDC(event: TransferEventTJBTCbUSDC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJBTCbUSDC = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJDAIeUSDC(event: TransferEventTJDAIeUSDC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJDAIeUSDC = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferTJsAVAXAVAX(event: TransferEventTJsAVAXAVAX): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldTJsAVAXAVAX = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}