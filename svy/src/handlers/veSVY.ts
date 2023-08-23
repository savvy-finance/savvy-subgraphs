import {
  Claimed as ClaimedEvent,
  Staked as StakedEvent,
  Unstaked as UnstakedEvent
} from "../../generated/veSVY/veSVY";
import { updateStakedSVYBalance, updateVeSVYBalance } from "../helpers/account";

export function handleStaked(event: StakedEvent): void {
  updateStakedSVYBalance(
    event.params.user,
    event.params.amount,
    event.block
  );
}

export function handleClaimed(event: ClaimedEvent): void {
  updateVeSVYBalance(
    event.params.user,
    event.block,
    null
  );
}

export function handleUnstaked(event: UnstakedEvent): void {
  updateStakedSVYBalance(
    event.params.user,
    event.params.amount,
    event.block
  );
}