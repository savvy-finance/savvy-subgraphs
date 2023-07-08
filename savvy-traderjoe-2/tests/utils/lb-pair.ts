import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  DepositedToBins,
  Swap,
  TransferBatch,
  WithdrawnFromBins
} from "../../generated/LBPair/LBPair"

export function createDepositedToBinsEvent(
  sender: Address,
  to: Address,
  ids: Array<BigInt>,
  amounts: Array<Bytes>
): DepositedToBins {
  let depositedToBinsEvent = changetype<DepositedToBins>(newMockEvent())

  depositedToBinsEvent.parameters = new Array()

  depositedToBinsEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  depositedToBinsEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  depositedToBinsEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  depositedToBinsEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromFixedBytesArray(amounts)
    )
  )

  return depositedToBinsEvent
}

export function createSwapEvent(
  sender: Address,
  to: Address,
  id: i32,
  amountsIn: Bytes,
  amountsOut: Bytes,
  volatilityAccumulator: i32,
  totalFees: Bytes,
  protocolFees: Bytes
): Swap {
  let swapEvent = changetype<Swap>(newMockEvent())

  swapEvent.parameters = new Array()

  swapEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "id",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(id))
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amountsIn",
      ethereum.Value.fromFixedBytes(amountsIn)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amountsOut",
      ethereum.Value.fromFixedBytes(amountsOut)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "volatilityAccumulator",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(volatilityAccumulator))
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "totalFees",
      ethereum.Value.fromFixedBytes(totalFees)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFees",
      ethereum.Value.fromFixedBytes(protocolFees)
    )
  )

  return swapEvent
}

export function createTransferBatchEvent(
  sender: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  amounts: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent())

  transferBatchEvent.parameters = new Array()

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromUnsignedBigIntArray(amounts)
    )
  )

  return transferBatchEvent
}

export function createWithdrawnFromBinsEvent(
  sender: Address,
  to: Address,
  ids: Array<BigInt>,
  amounts: Array<Bytes>
): WithdrawnFromBins {
  let withdrawnFromBinsEvent = changetype<WithdrawnFromBins>(newMockEvent())

  withdrawnFromBinsEvent.parameters = new Array()

  withdrawnFromBinsEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawnFromBinsEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawnFromBinsEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  withdrawnFromBinsEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromFixedBytesArray(amounts)
    )
  )

  return withdrawnFromBinsEvent
}
