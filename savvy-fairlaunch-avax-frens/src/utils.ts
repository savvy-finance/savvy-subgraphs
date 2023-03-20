import { User } from "../generated/schema";

// export const AVAX_RPC = "https://api.avax-test.network/ext/bc/C/rpc"

export function getUser(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.everHeldAnyBeefy = false;
    user.everHeldBIFI = false;
    user.everHeldDAIUSDCUSDTCurve = false;
    user.everHeldUSDCUSDCeTJ = false;
    user.everHeldAVAXAave = false;
    user.everHeldUSDCUSDCePangolin = false;
    user.everHeldAvaxBlizz = false;
    user.everHeldUSDCAave = false;
    user.everHeldUSDTAave = false;
    user.everHeldUSDTUSDTeTJ = false;

    user.everHeldAnyYieldYak = false;
    user.everHeldYAK = false;
    user.everHeldAaveYYAVAX = false;
    user.everHeldAaveYYUSDT = false;
    user.everHeldAaveYYUSDC = false;
    user.everHeldAaveYYBTCb = false;
    user.everHeldBenqiYYDAIe = false;
    user.everHeldBenqiYYUSDT = false;
    user.everHeldBenqiYYAVAX = false;
    user.everHeldBenqiYYBTCb = false;
    user.everHeldBenqiYYUSDC = false;
    user.everHeldPlatypusYYBTCb = false;

    user.everHeldAnyVesper = false;
    user.everHeldVSP = false;
    user.everHeldVAAVAX = false;
    user.everHeldVADAIe = false;
    user.everHeldVAUSDCe = false;
    user.everHeldVAUSDCn = false;
    user.everHeldVAWBTC = false;

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