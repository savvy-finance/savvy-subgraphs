import { Transfer as TransferEventALCX } from "../generated/ALCX/AlchemixToken";
import { Transfer as TransferEventAlUSD } from "../generated/alUSD/AlToken";
import { Transfer as TransferEventAlEth } from "../generated/alEth/AlEth";
import { Transfer as TransferEventVSP } from "../generated/VSP/VSPToken";
import { Transfer as TransferEventUSH } from "../generated/USH/USHToken";
import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldALCX = false;
    user.everHeldAlUSD = false;
    user.everHeldAlETH = false;
    user.everHeldVSP = false;
    user.everHeldUSH = false;
  }
  return user;
}

export function handleTransferALCX(event: TransferEventALCX): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldALCX = true;
  user.save();
}

export function handleTransferAlUSD(event: TransferEventAlUSD): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAlUSD = true;
  user.save();
}

export function handleTransferAlETH(event: TransferEventAlEth): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldAlETH = true;
  user.save();
}

export function handleTransferVSP(event: TransferEventVSP): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldVSP = true;
  user.save();
}

export function handleTransferUSH(event: TransferEventUSH): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldUSH = true;
  user.save();
}
