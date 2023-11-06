import {
  DepositedToBins as DepositedToBinsEvent,
  Swap as SwapEvent,
  TransferBatch as TransferBatchEvent,
  WithdrawnFromBins as WithdrawnFromBinsEvent,
} from "../../generated/LBPair/LBPair";
import { refreshAllAccountBalances, updateBinIds } from "../helpers/account";
import { updateLiquidityPool } from "../helpers/liquidity-pool";

export function handleDepositedToBins(event: DepositedToBinsEvent): void {
  const blockNumber = event.block.number;
  const timestamp = event.block.timestamp;
  updateLiquidityPool(event.address, blockNumber, timestamp);
  updateBinIds(event.params.sender, event.address, event.params.ids);
  updateBinIds(event.params.to, event.address, event.params.ids);
  refreshAllAccountBalances(event.address, blockNumber, timestamp);
}

export function handleSwap(event: SwapEvent): void {
  const blockNumber = event.block.number;
  const timestamp = event.block.timestamp;
  updateLiquidityPool(event.address, blockNumber, timestamp);
  refreshAllAccountBalances(event.address, blockNumber, timestamp);
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  const blockNumber = event.block.number;
  const timestamp = event.block.timestamp;
  updateLiquidityPool(event.address, blockNumber, timestamp);
  updateBinIds(event.params.sender, event.address, event.params.ids);
  updateBinIds(event.params.to, event.address, event.params.ids);
  refreshAllAccountBalances(event.address, blockNumber, timestamp);
}

export function handleWithdrawnFromBins(event: WithdrawnFromBinsEvent): void {
  const blockNumber = event.block.number;
  const timestamp = event.block.timestamp;
  updateLiquidityPool(event.address, blockNumber, timestamp);
  updateBinIds(event.params.sender, event.address, event.params.ids);
  updateBinIds(event.params.to, event.address, event.params.ids);
  refreshAllAccountBalances(event.address, blockNumber, timestamp);
}
