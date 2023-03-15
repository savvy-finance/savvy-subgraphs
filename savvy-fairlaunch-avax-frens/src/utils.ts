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
  }
  return user;
}

// export const TOKEN_ADDRESSES = {
//    BIFI: "0xd6070ae98b8069de6B494332d1A1a81B6179D960",
//    DAIUSDCUSDTCurve: "0x79A44dc13e5863Cf4AB36ab13e038A5F16861Abc",
//    USDCUSDCeTJ: "0x42ab5A790E99dF1b5d46f1C5C3e61d0Cd63D1f6E",
//    AVAXAave: "0x1B156C5c75E9dF4CAAb2a5cc5999aC58ff4F9090",
//    USDCUSDCePangolin: "0x99C719c26C64A371be84bAF0821fA89a1FEd459a",
//    AvaxBlizz: "0x99EeB92A4896a9F45E9390e2A05ceE5647BA0f95"
//  };