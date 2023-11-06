import { Transfer as TransferEventSVY } from "../generated/SVY/SVY";
import { Transfer as TransferEventSVUSD } from "../generated/SVUSD/SVUSD";
import { Transfer as TransferEventSVETH } from "../generated/SVETH/SVETH";
import { Transfer as TransferEventSVBTC } from "../generated/SVBTC/SVBTC";
import { User } from "../generated/schema";

function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldSVY = false;
    user.everHeldSVUSD = false;
    user.everHeldSVETH = false;
    user.everHeldSVBTC = false;
  }
  return user;
}

export function handleTransferSVY(event: TransferEventSVY): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldSVY = true;
  user.save();
}

export function handleTransferSVUSD(event: TransferEventSVUSD): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldSVUSD = true;
  user.save();
}

export function handleTransferSVETH(event: TransferEventSVETH): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldSVETH = true;
  user.save();
}

export function handleTransferSVBTC(event: TransferEventSVBTC): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldSVBTC = true;
  user.save();
}