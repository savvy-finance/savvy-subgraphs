import {
  Deposit,
  Withdraw,
  Claim,
  Swap
} from "../generated/SavvySwapBTC/SavvySwap"
import {
  createDepositEvent,
  createWithdrawEvent,
  createClaimEvent,
  createSwapEvent
} from "./helpers/savvySwap";

export function handleDeposit(event: Deposit): void {
  createDepositEvent(event);
}

export function handleWithdraw(event: Withdraw): void {
  createWithdrawEvent(event);
}

export function handleClaim(event: Claim): void {
  createClaimEvent(event);
}

export function handleSwap(event: Swap): void {
  createSwapEvent(event);
}
