import { Transfer as TransferEventJoe } from "../generated/JOE/JoeToken";
import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldJOE = false;
  }
  return user;
}

export function handleTransferJoe(event: TransferEventJoe): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldJOE = true;
  user.save();
}
