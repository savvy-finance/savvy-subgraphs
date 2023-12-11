import { Staked, Unstaked, Claimed } from "../../generated/SavvyVeSVY/VeSVY";
import {
  createStakedEvent,
  createUnstakedEvent,
  createClaimedEvent,
} from "../helpers/savvyVeSvy";
import { getOrCreateAccount } from "../helpers/account";

export function handleStaked(event: Staked): void {
  createStakedEvent(event);
  let account = getOrCreateAccount(event.params.user.toHexString());
  account.stakedSVY = account.stakedSVY.plus(event.params.amount);
  account.save();
}

export function handleUnstaked(event: Unstaked): void {
  createUnstakedEvent(event);
  let account = getOrCreateAccount(event.params.user.toHexString());
  account.stakedSVY = account.stakedSVY.plus(event.params.amount);
  account.save();
}

export function handleClaimed(event: Claimed): void {
  createClaimedEvent(event);
}
