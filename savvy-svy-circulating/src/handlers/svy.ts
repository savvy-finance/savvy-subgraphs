import { ethereum } from "@graphprotocol/graph-ts";
import { updateCirculatingSVY } from "../helpers/protocol";

export function handleBlock(block: ethereum.Block): void {
  updateCirculatingSVY(block);
}
