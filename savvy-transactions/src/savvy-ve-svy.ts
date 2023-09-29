import {
  Staked,
  Unstaked,
  Claimed,
} from "../generated/VeSVY/VeSVY"
import {
  createStakedEvent,
  createUnstakedEvent,
  createClaimedEvent,
} from "./helpers/savvyVeSvy";

export function handleStaked(event: Staked): void {
  createStakedEvent(event);
}

export function handleUnstaked(event: Unstaked): void {
  createUnstakedEvent(event);
}

export function handleClaimed(event: Claimed): void {
  createClaimedEvent(event);
}
