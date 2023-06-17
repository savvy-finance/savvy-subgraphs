import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll,
  CollectedProtocolFees,
  CompositionFees,
  DepositedToBins,
  FlashLoan,
  ForcedDecay,
  OracleLengthIncreased,
  StaticFeeParametersSet,
  Swap,
  TransferBatch,
  WithdrawnFromBins
} from "../generated/LBPair/LBPair"

export function createApprovalForAllEvent(
  account: Address,
  sender: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createCollectedProtocolFeesEvent(
  feeRecipient: Address,
  protocolFees: Bytes
): CollectedProtocolFees {
  let collectedProtocolFeesEvent = changetype<CollectedProtocolFees>(
    newMockEvent()
  )

  collectedProtocolFeesEvent.parameters = new Array()

  collectedProtocolFeesEvent.parameters.push(
    new ethereum.EventParam(
      "feeRecipient",
      ethereum.Value.fromAddress(feeRecipient)
    )
  )
  collectedProtocolFeesEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFees",
      ethereum.Value.fromFixedBytes(protocolFees)
    )
  )

  return collectedProtocolFeesEvent
}

export function createCompositionFeesEvent(
  sender: Address,
  id: i32,
  totalFees: Bytes,
  protocolFees: Bytes
): CompositionFees {
  let compositionFeesEvent = changetype<CompositionFees>(newMockEvent())

  compositionFeesEvent.parameters = new Array()

  compositionFeesEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  compositionFeesEvent.parameters.push(
    new ethereum.EventParam(
      "id",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(id))
    )
  )
  compositionFeesEvent.parameters.push(
    new ethereum.EventParam(
      "totalFees",
      ethereum.Value.fromFixedBytes(totalFees)
    )
  )
  compositionFeesEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFees",
      ethereum.Value.fromFixedBytes(protocolFees)
    )
  )

  return compositionFeesEvent
}

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

export function createFlashLoanEvent(
  sender: Address,
  receiver: Address,
  activeId: i32,
  amounts: Bytes,
  totalFees: Bytes,
  protocolFees: Bytes
): FlashLoan {
  let flashLoanEvent = changetype<FlashLoan>(newMockEvent())

  flashLoanEvent.parameters = new Array()

  flashLoanEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam(
      "activeId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(activeId))
    )
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam("amounts", ethereum.Value.fromFixedBytes(amounts))
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam(
      "totalFees",
      ethereum.Value.fromFixedBytes(totalFees)
    )
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam(
      "protocolFees",
      ethereum.Value.fromFixedBytes(protocolFees)
    )
  )

  return flashLoanEvent
}

export function createForcedDecayEvent(
  sender: Address,
  idReference: i32,
  volatilityReference: i32
): ForcedDecay {
  let forcedDecayEvent = changetype<ForcedDecay>(newMockEvent())

  forcedDecayEvent.parameters = new Array()

  forcedDecayEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  forcedDecayEvent.parameters.push(
    new ethereum.EventParam(
      "idReference",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(idReference))
    )
  )
  forcedDecayEvent.parameters.push(
    new ethereum.EventParam(
      "volatilityReference",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(volatilityReference))
    )
  )

  return forcedDecayEvent
}

export function createOracleLengthIncreasedEvent(
  sender: Address,
  oracleLength: i32
): OracleLengthIncreased {
  let oracleLengthIncreasedEvent = changetype<OracleLengthIncreased>(
    newMockEvent()
  )

  oracleLengthIncreasedEvent.parameters = new Array()

  oracleLengthIncreasedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  oracleLengthIncreasedEvent.parameters.push(
    new ethereum.EventParam(
      "oracleLength",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(oracleLength))
    )
  )

  return oracleLengthIncreasedEvent
}

export function createStaticFeeParametersSetEvent(
  sender: Address,
  baseFactor: i32,
  filterPeriod: i32,
  decayPeriod: i32,
  reductionFactor: i32,
  variableFeeControl: i32,
  protocolShare: i32,
  maxVolatilityAccumulator: i32
): StaticFeeParametersSet {
  let staticFeeParametersSetEvent = changetype<StaticFeeParametersSet>(
    newMockEvent()
  )

  staticFeeParametersSetEvent.parameters = new Array()

  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam(
      "baseFactor",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(baseFactor))
    )
  )
  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam(
      "filterPeriod",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(filterPeriod))
    )
  )
  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam(
      "decayPeriod",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(decayPeriod))
    )
  )
  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam(
      "reductionFactor",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(reductionFactor))
    )
  )
  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam(
      "variableFeeControl",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(variableFeeControl))
    )
  )
  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam(
      "protocolShare",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(protocolShare))
    )
  )
  staticFeeParametersSetEvent.parameters.push(
    new ethereum.EventParam(
      "maxVolatilityAccumulator",
      ethereum.Value.fromUnsignedBigInt(
        BigInt.fromI32(maxVolatilityAccumulator)
      )
    )
  )

  return staticFeeParametersSetEvent
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
