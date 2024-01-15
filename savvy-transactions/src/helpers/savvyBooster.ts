import {
  Deposit,
  Withdraw,
  Claim,
} from "../../generated/SavvyBooster/SavvyBooster"
import {
  SBDeposit,
  SBWithdraw,
  SBClaim,
} from "../../generated/schema";
import { createEvent } from "./utils";

export function createDepositEvent(event: Deposit): SBDeposit {
  const staked = createEvent<SBDeposit>(event);
  staked.poolId = event.params.poolId;
  staked.amount = event.params.amount;
  staked.save();
  return staked;
}

export function createWithdrawEvent(event: Withdraw): SBWithdraw {
  const unstaked = createEvent<SBWithdraw>(event);
  unstaked.amount = event.params.amount;
  unstaked.save();
  return unstaked;
}

export function createClaimEvent(event: Claim): SBClaim {
  const claimed = createEvent<SBClaim>(event);
  claimed.user = event.params.user;
  claimed.rewardAmount = event.params.rewardAmount;
  claimed.pendingAmount = event.params.pendingAmount;
  claimed.save();
  return claimed;
}
