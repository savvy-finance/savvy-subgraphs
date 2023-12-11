import { Transfer } from "../../generated/SavvySVY/SVY";
import { SvyTransferred } from "../../generated/schema";
import { createEvent } from "./utils";

export function createTransferEvent(event: Transfer): SvyTransferred {
  const Transferred = createEvent<SvyTransferred>(event);
  Transferred.from = event.params.from;
  Transferred.to = event.params.to;
  Transferred.amount = event.params.value;
  Transferred.save();
  return Transferred;
}
