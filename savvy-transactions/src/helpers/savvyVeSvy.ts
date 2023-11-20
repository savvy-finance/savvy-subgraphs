import {
  Staked,
  Unstaked,
  Claimed,
} from "../../generated/VeSVY/VeSVY"
import {
  VeSStaked,
  VeSUnstaked,
  VeSClaimed,
} from "../../generated/schema";
import { createEvent } from "./utils";

export function createStakedEvent(event: Staked): VeSStaked {
  const staked = createEvent<VeSStaked>(event);
  staked.sender = event.params.sender;
  staked.user = event.params.user;
  staked.amount = event.params.amount;
  staked.save();
  return staked;
}

export function createUnstakedEvent(event: Unstaked): VeSUnstaked {
  const unstaked = createEvent<VeSUnstaked>(event);
  unstaked.user = event.params.user;
  unstaked.amount = event.params.amount;
  unstaked.save();
  return unstaked;
}

export function createClaimedEvent(event: Claimed): VeSClaimed {
  const claimed = createEvent<VeSClaimed>(event);
  claimed.user = event.params.user;
  claimed.amount = event.params.amount;
  claimed.save();
  return claimed;
}
