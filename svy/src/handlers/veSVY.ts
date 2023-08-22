import {
  Claimed as ClaimedEvent,
  Staked as StakedEvent,
  Unstaked as UnstakedEvent
} from "../../generated/veSVY/veSVY";
import { updateVeSVYBalance } from "../helpers/balance";

export function handleStaked(event: StakedEvent): void {
  updateVeSVYBalance(event.params.user, event.block);
}

export function handleClaimed(event: ClaimedEvent): void {
  updateVeSVYBalance(event.params.user, event.block);
}

export function handleUnstaked(event: UnstakedEvent): void {
  updateVeSVYBalance(event.params.user, event.block);
}