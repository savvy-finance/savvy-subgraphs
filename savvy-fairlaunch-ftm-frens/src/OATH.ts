import { Transfer as TransferEventOATH } from "../generated/OATH/OATHToken";

import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldOATH = false;
  }
  return user;
}

export function handleTransferOATH(event: TransferEventOATH): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldOATH = true;
  user.save();
}

