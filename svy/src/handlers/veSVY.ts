import {
  Claimed as ClaimedEvent,
  Staked as StakedEvent,
  Unstaked as UnstakedEvent
} from "../../generated/veSVY/veSVY";
import { updateVeSVYBalance } from "../helpers/account";

export function handleStaked(event: StakedEvent): void {
  updateVeSVYBalance(
    event.params.user,
    "Staked",
    event.params.amount,
    event.block
  );
}

export function handleClaimed(event: ClaimedEvent): void {
  updateVeSVYBalance(
    event.params.user,
    "Claimed",
    event.params.amount,
    event.block
  );
}

export function handleUnstaked(event: UnstakedEvent): void {
  updateVeSVYBalance(
    event.params.user,
    "Unstaked",
    event.params.amount,
    event.block
  );
}