import { Transfer as TransferEventJOE } from "../generated/JOE/JOE";
import { Transfer as TransferEventUSH } from "../generated/USH/USH";
import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldJOE = false;
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
