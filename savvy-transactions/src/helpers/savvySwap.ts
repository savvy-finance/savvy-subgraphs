import {
  Claim,
  Deposit,
  Swap,
  Withdraw,
} from "../../generated/SavvySwapBTC/SavvySwap";
import {
  SSDeposit,
  SSWithdraw,
  SSClaim,
  SSSwap,
} from "../../generated/schema";
import { createEvent } from "./utils";

export function createDepositEvent(event: Deposit): SSDeposit {
  const depositEvent = createEvent<SSDeposit>(event);
  depositEvent.sender = event.params.sender;
  depositEvent.recipient = event.params.owner;
  depositEvent.amount = event.params.amount;
  depositEvent.save();
  return depositEvent;
}

export function createWithdrawEvent(event: Withdraw): SSWithdraw {
  const withdrawEvent = createEvent<SSWithdraw>(event);
  withdrawEvent.sender = event.params.sender;
  withdrawEvent.recipient = event.params.recipient;
  withdrawEvent.amount = event.params.amount;
  withdrawEvent.save();
  return withdrawEvent;
}

export function createClaimEvent(event: Claim): SSClaim {
  const claimEvent = createEvent<SSClaim>(event);
  claimEvent.sender = event.params.sender;
  claimEvent.recipient = event.params.recipient;
  claimEvent.amount = event.params.amount;
  claimEvent.save();
  return claimEvent;
}

export function createSwapEvent(event: Swap): SSSwap {
  const swapEvent = createEvent<SSSwap>(event);
  swapEvent.sender = event.params.sender;
  swapEvent.amount = event.params.amount;
  swapEvent.save();
  return swapEvent;
}
