import { getUser } from "./utils";

import { Transfer as TransferEventYAK } from "../generated/YAK/YAKToken";
import { Transfer as TransferEventAaveYYAVAX } from "../generated/AaveYYAVAX/AaveYYAVAXToken";
import { Transfer as TransferEventAaveYYUSDT } from "../generated/AaveYYUSDT/AaveYYUSDTToken";
import { Transfer as TransferEventAaveYYUSDC } from "../generated/AaveYYUSDC/AaveYYUSDCToken";
import { Transfer as TransferEventAaveYYBTCb } from "../generated/AaveYYBTCb/AaveYYBTCbToken";
import { Transfer as TransferEventBenqiYYDAIe } from "../generated/BenqiYYDAIe/BenqiYYDAIeToken";
import { Transfer as TransferEventBenqiYYUSDT } from "../generated/BenqiYYUSDT/BenqiYYUSDTToken";
import { Transfer as TransferEventBenqiYYAVAX } from "../generated/BenqiYYAVAX/BenqiYYAVAXToken";
import { Transfer as TransferEventBenqiYYBTCb } from "../generated/BenqiYYBTCb/BenqiYYBTCbToken";
import { Transfer as TransferEventBenqiYYUSDC } from "../generated/BenqiYYUSDC/BenqiYYUSDCToken";
import { Transfer as TransferEventPlatypusYYBTCb } from "../generated/PlatypusYYBTCb/PlatypusYYBTCbToken";

export function handleTransferYAK(event: TransferEventYAK): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldYAK = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferAaveYYAVAX(event: TransferEventAaveYYAVAX): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAaveYYAVAX = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferAaveYYUSDT(event: TransferEventAaveYYUSDT): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAaveYYUSDT = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferAaveYYUSDC(event: TransferEventAaveYYUSDC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAaveYYUSDC = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferAaveYYBTCb(event: TransferEventAaveYYBTCb): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAaveYYBTCb = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferBenqiYYDAIe(event: TransferEventBenqiYYDAIe): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldBenqiYYDAIe = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferBenqiYYUSDT(event: TransferEventBenqiYYUSDT): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldBenqiYYUSDT = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferBenqiYYAVAX(event: TransferEventBenqiYYAVAX): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldBenqiYYAVAX = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferBenqiYYBTCb(event: TransferEventBenqiYYBTCb): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldBenqiYYBTCb = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferBenqiYYUSDC(event: TransferEventBenqiYYUSDC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldBenqiYYUSDC = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}

export function handleTransferPlatypusYYBTCb(event: TransferEventPlatypusYYBTCb): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldPlatypusYYBTCb = true;
  user.everHeldAnyYieldYak = true;
  user.save();
}