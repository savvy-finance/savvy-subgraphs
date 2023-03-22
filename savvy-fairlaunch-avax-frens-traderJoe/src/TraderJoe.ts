import { Transfer as TransferEventJOE } from "../generated/JOE/JOEToken";
import { Transfer as TransferEventAVAX } from "../generated/AVAX/AVAXToken";
import { User } from "../generated/schema";
import { getUser } from "./utils";
import { AVAXPools } from "./contracts";

export function handleTransferJOE(event: TransferEventJOE): void {
  const user = getUser(event.params.to.toHexString());
  user.everHeldJOE = true;
  user.everHeldAnyTraderJoe = true;
  user.save();
}

export function handleTransferAVAX(event: TransferEventAVAX): void {
  const toAddress = event.params.to.toHexString();
  const fromAddress = event.params.from.toHexString();
  let isToAddressInAVAXPools = false;
  let isFromAddressInAVAXPools = false;
  let toPoolName = '';
  let fromPoolName = '';

  for (let i = 0; i < AVAXPools.length; i++) {
    if (AVAXPools[i].address == toAddress) {
      isToAddressInAVAXPools = true;
      toPoolName = AVAXPools[i].name;
    }
    if (AVAXPools[i].address == fromAddress) {
      isFromAddressInAVAXPools = true;
      fromPoolName = AVAXPools[i].name;
    }
    if (isToAddressInAVAXPools && isFromAddressInAVAXPools) break;
  }

  if (isToAddressInAVAXPools) {
    const user = getUser(fromAddress);
    setUserEverHeldProperty(user, toPoolName);
    user.everHeldAnyTraderJoe = true;
    user.save();
  } else if (isFromAddressInAVAXPools) {
    const user = getUser(toAddress);
    setUserEverHeldProperty(user, fromPoolName);
    user.everHeldAnyTraderJoe = true;
    user.save();
  }
}

function setUserEverHeldProperty(user: User, poolName: string): void {
  if (poolName == 'TJBTCbAVAX') {
    user.everHeldTJBTCbAVAX = true;
  } else if (poolName == 'TJAVAXUSDC') {
    user.everHeldTJAVAXUSDC = true;
  } else if (poolName == 'TJJOEAVAX') {
    user.everHeldTJJOEAVAX = true;
  } else if (poolName == 'TJAVAXUSDT') {
    user.everHeldTJAVAXUSDT = true;
  } else if (poolName == 'TJsAVAXAVAX') {
    user.everHeldTJsAVAXAVAX = true;
  }
}