import { ethereum } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../../generated/SavvyProtocolToken/SavvyProtocolToken";
import { receiveSVY, sendSVY } from "../helpers/account";
import { updateCirculatingSVY } from "../helpers/protocol";

export function handleTransfer(event: TransferEvent): void {
  const svyAmount = event.params.value;
  sendSVY(event.params.from, svyAmount, event.block);
  receiveSVY(event.params.to, svyAmount, event.block);
}

export function handleBlock(block: ethereum.Block): void {
  updateCirculatingSVY(block);
}
