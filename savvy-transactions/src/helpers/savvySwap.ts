import {
  Claim,
  Deposit,
  Swap,
  Withdraw,
} from "../../generated/SavvySwapUSDC/SavvySwap";
import {
  SwapDepositEvent,
  SwapWithdrawEvent,
  SwapClaimEvent,
  SwapSwapEvent,
} from "../../generated/schema";
import { createEvent } from "./utils";

export function createDepositEvent(event: Deposit): SwapDepositEvent {
  const depositEvent = createEvent<SwapDepositEvent>(event);
  depositEvent.sender = event.params.sender.toHexString();
  depositEvent.owner = event.params.owner.toHexString();
  depositEvent.amount = event.params.amount;
  depositEvent.save();
  return depositEvent;
}

export function createWithdrawEvent(event: Withdraw): SwapWithdrawEvent {
  const withdrawEvent = createEvent<SwapWithdrawEvent>(event);
  withdrawEvent.sender = event.params.sender.toHexString();
  withdrawEvent.recipient = event.params.recipient.toHexString();
  withdrawEvent.amount = event.params.amount;
  withdrawEvent.save();
  return withdrawEvent;
}

export function createClaimEvent(event: Claim): SwapClaimEvent {
  const claimEvent = createEvent<SwapClaimEvent>(event);
  claimEvent.sender = event.params.sender.toHexString();
  claimEvent.recipient = event.params.recipient.toHexString();
  claimEvent.amount = event.params.amount;
  claimEvent.save();
  return claimEvent;
}

export function createSwapEvent(event: Swap): SwapSwapEvent {
  const swapEvent = createEvent<SwapSwapEvent>(event);
  swapEvent.sender = event.params.sender.toHexString();
  swapEvent.amount = event.params.amount;
  swapEvent.save();
  return swapEvent;
}
