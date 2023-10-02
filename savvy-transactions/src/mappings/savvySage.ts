import { SetFlowRate } from "../../generated/SavvySageUSD/SavvySage";
import { createSetFlowRateEvent } from "../helpers/savvySage";

export function handleSetFlowRateEvent(event: SetFlowRate): void {
  createSetFlowRateEvent(event);
}
