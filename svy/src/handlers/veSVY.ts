import {
  Claimed as ClaimedEvent,
  Staked as StakedEvent,
  Unstaked as UnstakedEvent
} from "../../generated/veSVY/veSVY";
import { BIGINT_ZERO } from "../constants";
import { updateVeSVYBalance } from "../helpers/account";

export function handleStaked(event: StakedEvent): void {
  updateVeSVYBalance(event.params.user, BIGINT_ZERO.minus(event.params.amount), event.block);
}

export function handleClaimed(event: ClaimedEvent): void {
  updateVeSVYBalance(event.params.user, event.params.amount, event.block);
}

export function handleUnstaked(event: UnstakedEvent): void {
  updateVeSVYBalance(event.params.user, event.params.amount, event.block);
}