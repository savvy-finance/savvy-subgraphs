import {
  DepositedToBins as DepositedToBinsEvent,
  Swap as SwapEvent,
  TransferBatch as TransferBatchEvent,
  WithdrawnFromBins as WithdrawnFromBinsEvent
} from "../../generated/LBPair/LBPair";
import { updateLiquidityPool } from "../helpers/liquidity-pool";

export function handleDepositedToBins(event: DepositedToBinsEvent): void {
  updateLiquidityPool(event.address, event.block);
}

export function handleSwap(event: SwapEvent): void {
  updateLiquidityPool(event.address, event.block);
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  updateLiquidityPool(event.address, event.block);
}

export function handleWithdrawnFromBins(event: WithdrawnFromBinsEvent): void {
  updateLiquidityPool(event.address, event.block);
}
