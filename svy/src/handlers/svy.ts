import {
  Transfer as TransferEvent
} from "../../generated/SavvyProtocolToken/SavvyProtocolToken";
import {
  increaseTotalSvyDistributed,
  receiveSVY,
  sendSVY
} from "../helpers/balance";

export function handleTransfer(event: TransferEvent): void {
  const svyAmount = event.params.value;
  sendSVY(event.params.from, svyAmount, event.block);
  receiveSVY(event.params.to, svyAmount, event.block);
  increaseTotalSvyDistributed(event.params.from, svyAmount, event.block);
}