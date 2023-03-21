import { Transfer as TransferEventGrizzly } from "../generated/Grizzly/GrizzlyToken";

import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldGrizzly = false;
  }
  return user;
}

export function handleTransferGrizzly(event: TransferEventGrizzly): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldGrizzly = true;
  user.save();
}

