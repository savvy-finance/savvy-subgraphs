import { ethereum } from "@graphprotocol/graph-ts";
import { TJ_LP_SVBTC, TJ_LP_SVETH, TJ_LP_SVUSD } from "./constants";
import { createPairHourlySnapshot, updatePair } from "./helpers/pair";
import { DepositedToBins, WithdrawnFromBins } from '../generated/LBPair/LBPair';

function handlePair(block: ethereum.Block, contractAddress: string): void {
  updatePair(block, contractAddress);
}

export function handleSvUSDPair(block: ethereum.Block): void {
  handlePair(block, TJ_LP_SVUSD);
}
export function handleSvETHPair(block: ethereum.Block): void {
  handlePair(block, TJ_LP_SVETH);
}
export function handleSvBTCPair(block: ethereum.Block): void {
  handlePair(block, TJ_LP_SVBTC);
}

export function handleAddLiquidity(event: DepositedToBins): void {
  createPairHourlySnapshot(event.block, event.address.toHexString());
}
export function handleRemoveLiquidity(event: WithdrawnFromBins): void {
  createPairHourlySnapshot(event.block, event.address.toHexString());
}