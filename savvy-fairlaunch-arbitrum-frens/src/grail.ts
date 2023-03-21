import { Transfer as TransferEventGRAIL } from "../generated/GRAIL/GRAILToken";

import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldGRAIL = false;
  }
  return user;
}

export function handleTransferGRAIL(event: TransferEventGRAIL): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldGRAIL = true;
  user.save();
}

