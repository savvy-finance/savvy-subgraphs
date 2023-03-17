import { Transfer as TransferEventVAAVAX } from "../generated/vaAVAX/vaAVAXToken";
import { Transfer as TransferEventVADAIe } from "../generated/vaDAIe/vaDAIeToken";
import { Transfer as TransferEventVAUSDCe } from "../generated/vaUSDCe/vaUSDCeToken";
import { Transfer as TransferEventVAUSDCn } from "../generated/vaUSDCn/vaUSDCnToken";
import { Transfer as TransferEventVAWBTC } from "../generated/vaWBTC/vaWBTCToken";
import { getUser } from "./utils";

export function handleTransferVAAVAX(event: TransferEventVAAVAX): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldVAAVAX = true;
  user.everHeldAnyVesper = true;
  user.save();
}

export function handleTransferVADAIe(event: TransferEventVADAIe): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldVADAIe = true;
  user.everHeldAnyVesper = true;
  user.save();
}

export function handleTransferVAUSDCe(event: TransferEventVAUSDCe): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldVAUSDCe = true;
  user.everHeldAnyVesper = true;
  user.save();
}

export function handleTransferVAUSDCn(event: TransferEventVAUSDCn): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldVAUSDCn = true;
  user.everHeldAnyVesper = true;
  user.save();
}

export function handleTransferVAWBTC(event: TransferEventVAWBTC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldVAWBTC = true;
  user.everHeldAnyVesper = true;
  user.save();
}