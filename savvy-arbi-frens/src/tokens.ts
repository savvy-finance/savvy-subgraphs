import { Transfer as TransferEventJOE } from "../generated/JOE/JOE";
import { Transfer as TransferEventUSH } from "../generated/USH/USH";
import { Transfer as TransferEventJONES } from "../generated/JONES/JONES";
import { Transfer as TransferEventBIFI } from "../generated/BIFI/BIFI";
import { Transfer as TransferEventSTG } from "../generated/STG/STG";
import { Transfer as TransferEventWMEMO } from "../generated/WMEMO/WMEMO";
import { Transfer as TransferEventRAM } from "../generated/RAM/RAM";
import { Transfer as TransferEventGRAIL } from "../generated/GRAIL/GRAIL";
import { Transfer as TransferEventGMD } from "../generated/GMD/GMD";
import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldJOE = false;
    user.everHeldUSH = false;
    user.everHeldJONES = false;
    user.everHeldBIFI = false;
    user.everHeldSTG = false;
    user.everHeldWMEMO = false;
    user.everHeldRAM = false;
    user.everHeldGRAIL = false;
    user.everHeldGMD = false;
  }
  return user;
}

export function handleTransferJOE(event: TransferEventJOE): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldJOE = true;
  user.save();
}

export function handleTransferUSH(event: TransferEventUSH): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldUSH = true;
  user.save();
}

export function handleTransferJONES(event: TransferEventJONES): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldJONES = true;
  user.save();
}

export function handleTransferBIFI(event: TransferEventBIFI): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldBIFI = true;
  user.save();
}

export function handleTransferSTG(event: TransferEventSTG): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldSTG = true;
  user.save();
}

export function handleTransferWMEMO(event: TransferEventWMEMO): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldWMEMO = true;
  user.save();
}

export function handleTransferRAM(event: TransferEventRAM): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldRAM = true;
  user.save();
}

export function handleTransferGRAIL(event: TransferEventGRAIL): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldGRAIL = true;
  user.save();
}

export function handleTransferGMD(event: TransferEventGMD): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldGMD = true;
  user.save();
}
