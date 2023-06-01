import { Transfer as TransferEventWMEMO } from "../generated/WMEMO/WMEMOToken";
import { getUser } from "./utils";

export function handleTransferWMEMO(event: TransferEventWMEMO): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldWMEMO = true;
  user.save();
}

