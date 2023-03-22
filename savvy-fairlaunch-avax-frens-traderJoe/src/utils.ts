import { User } from "../generated/schema";

// export const AVAX_RPC = "https://api.avax-test.network/ext/bc/C/rpc"

export function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);

    user.everHeldAnyTraderJoe = false;
    user.everHeldJOE = false;
    user.everHeldTJAVAXUSDC = false;
    user.everHeldTJBTCbAVAX = false;
    user.everHeldTJJOEAVAX = false;
    user.everHeldTJWBTCeBTCb = false;
    user.everHeldTJAVAXUSDT = false;
    user.everHeldTJUSDTUSDC = false;
    user.everHeldTJUSDCeUSDC = false;
    user.everHeldTJUSDTeUSDT = false;
    user.everHeldTJBTCbUSDC = false;
    user.everHeldTJDAIeUSDC = false;
    user.everHeldTJsAVAXAVAX = false;
  }
  return user;
}