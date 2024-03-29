import { Transfer as TransferEventBIFI } from "../generated/BIFI/BIFIToken";
import { Transfer as TransferEventDAIUSDCUSDT } from "../generated/DAIUSDCUSDTCurve/DAIUSDCUSDTCurveToken";
import { Transfer as TransferEventUSDCUSDCeTJ } from "../generated/USDCUSDCeTJ/USDCUSDCeTJToken";
import { Transfer as TransferEventAVAXAave } from "../generated/AVAXAave/AVAXAaveToken";
import { Transfer as TransferEventUSDCUSDCePangolin } from "../generated/USDCUSDCePangolin/USDCUSDCePangolinToken";
import { Transfer as TransferEventAvaxBlizz } from "../generated/AvaxBlizz/AvaxBlizzToken";
import { Transfer as TransferEventUSDCAave } from "../generated/USDCAave/USDCAaveToken";
import { Transfer as TransferEventUSDTAave } from "../generated/USDTAave/USDTAaveToken";
import { Transfer as TransferEventUSDTUSDTeTJ } from "../generated/USDTUSDTeTJ/USDTUSDTeTJToken";
import { getUser } from "./utils";

export function handleTransferBIFI(event: TransferEventBIFI): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldBIFI = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferDAIUSDCUSDT(event: TransferEventDAIUSDCUSDT): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldDAIUSDCUSDTCurve = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferUSDCUSDCeTJ(event: TransferEventUSDCUSDCeTJ): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldUSDCUSDCeTJ = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferAVAXAave(event: TransferEventAVAXAave): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAVAXAave = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferUSDCUSDCePangolin(event: TransferEventUSDCUSDCePangolin): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldUSDCUSDCePangolin = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferAvaxBlizz(event: TransferEventAvaxBlizz): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAvaxBlizz = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferUSDCAave(event: TransferEventUSDCAave): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldUSDCAave = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferUSDTAave(event: TransferEventUSDTAave): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldUSDTAave = true;
  user.everHeldAnyBeefy = true;
  user.save();
}

export function handleTransferUSDTUSDTeTJ(event: TransferEventUSDTUSDTeTJ): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldUSDTUSDTeTJ = true;
  user.everHeldAnyBeefy = true;
  user.save();
}