import {
  Deposit,
  Withdraw,
  Claim,
} from "../generated/SavvyBooster/SavvyBooster"
import {
  createDepositEvent,
  createWithdrawEvent,
  createClaimEvent,
} from "./helpers/savvyBooster";

export function handleDeposit(event: Deposit): void {
  createDepositEvent(event);
}

export function handleWithdraw(event: Withdraw): void {
  createWithdrawEvent(event);
}

export function handleClaim(event: Claim): void {
  createClaimEvent(event);
}
