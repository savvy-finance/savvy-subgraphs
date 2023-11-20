import { SetFlowRate } from "../../generated/SavvySageUSD/SavvySage";
import { SageSetFlowRateEvent } from "../../generated/schema";
import { createEvent } from "./utils";

export function createSetFlowRateEvent(
  event: SetFlowRate
): SageSetFlowRateEvent {
  const setFlowRateEvent = createEvent<SageSetFlowRateEvent>(event);
  setFlowRateEvent.baseToken = event.params.baseToken.toHexString();
  setFlowRateEvent.flowRate = event.params.flowRate;
  setFlowRateEvent.save();
  return setFlowRateEvent;
}
