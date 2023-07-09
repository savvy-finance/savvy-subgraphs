import {
  DepositedToBins as DepositedToBinsEvent,
  Swap as SwapEvent,
  TransferBatch as TransferBatchEvent,
  WithdrawnFromBins as WithdrawnFromBinsEvent
} from "../../generated/LBPair/LBPair";
import { updateBinIds } from "../helpers/account";
import { updateLiquidityPool } from "../helpers/liquidity-pool";

export function handleDepositedToBins(event: DepositedToBinsEvent): void {
  updateLiquidityPool(event.address, event.block);
  updateBinIds(event.params.sender, event.address, event.params.ids);
  updateBinIds(event.params.to, event.address, event.params.ids);
}

export function handleSwap(event: SwapEvent): void {
  updateLiquidityPool(event.address, event.block);
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  updateLiquidityPool(event.address, event.block);
  updateBinIds(event.params.from, event.address, event.params.ids);
  updateBinIds(event.params.to, event.address, event.params.ids);
}

export function handleWithdrawnFromBins(event: WithdrawnFromBinsEvent): void {
  updateLiquidityPool(event.address, event.block);
  updateBinIds(event.params.sender, event.address, event.params.ids);
  updateBinIds(event.params.to, event.address, event.params.ids);
}
