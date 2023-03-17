import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AllotmentsBought,
  Initialized,
  NFTCollectionInfoUpdated,
  OwnershipTransferStarted,
  OwnershipTransferred,
  Paused,
  ProtocolTokenUpdated,
  ProtocolTokenWithdrawn,
  ProtocolTokensClaimed,
  TimestampsUpdated,
  Unpaused,
  VestModesUpdated,
  VestStartTimestampUpdated
} from "../generated/SavvyLGE/SavvyLGE"

export function createAllotmentsBoughtEvent(
  userAddress: Address,
  deposited: BigInt,
  allotments: BigInt
): AllotmentsBought {
  let allotmentsBoughtEvent = changetype<AllotmentsBought>(newMockEvent())

  allotmentsBoughtEvent.parameters = new Array()

  allotmentsBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "userAddress",
      ethereum.Value.fromAddress(userAddress)
    )
  )
  allotmentsBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "deposited",
      ethereum.Value.fromUnsignedBigInt(deposited)
    )
  )
  allotmentsBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "allotments",
      ethereum.Value.fromUnsignedBigInt(allotments)
    )
  )

  return allotmentsBoughtEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createNFTCollectionInfoUpdatedEvent(
  nftCollectionAddress: Address,
  price: BigInt,
  limit: BigInt
): NFTCollectionInfoUpdated {
  let nftCollectionInfoUpdatedEvent = changetype<NFTCollectionInfoUpdated>(
    newMockEvent()
  )

  nftCollectionInfoUpdatedEvent.parameters = new Array()

  nftCollectionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "nftCollectionAddress",
      ethereum.Value.fromAddress(nftCollectionAddress)
    )
  )
  nftCollectionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  nftCollectionInfoUpdatedEvent.parameters.push(
    new ethereum.EventParam("limit", ethereum.Value.fromUnsignedBigInt(limit))
  )

  return nftCollectionInfoUpdatedEvent
}

export function createOwnershipTransferStartedEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferStarted {
  let ownershipTransferStartedEvent = changetype<OwnershipTransferStarted>(
    newMockEvent()
  )

  ownershipTransferStartedEvent.parameters = new Array()

  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferStartedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createProtocolTokenUpdatedEvent(
  protocolToken: Address,
  totalProtocolToken: BigInt
): ProtocolTokenUpdated {
  let protocolTokenUpdatedEvent = changetype<ProtocolTokenUpdated>(
    newMockEvent()
  )

  protocolTokenUpdatedEvent.parameters = new Array()

  protocolTokenUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "protocolToken",
      ethereum.Value.fromAddress(protocolToken)
    )
  )
  protocolTokenUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalProtocolToken",
      ethereum.Value.fromUnsignedBigInt(totalProtocolToken)
    )
  )

  return protocolTokenUpdatedEvent
}

export function createProtocolTokenWithdrawnEvent(
  protocolToken: Address,
  totalProtocolToken: BigInt
): ProtocolTokenWithdrawn {
  let protocolTokenWithdrawnEvent = changetype<ProtocolTokenWithdrawn>(
    newMockEvent()
  )

  protocolTokenWithdrawnEvent.parameters = new Array()

  protocolTokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "protocolToken",
      ethereum.Value.fromAddress(protocolToken)
    )
  )
  protocolTokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "totalProtocolToken",
      ethereum.Value.fromUnsignedBigInt(totalProtocolToken)
    )
  )

  return protocolTokenWithdrawnEvent
}

export function createProtocolTokensClaimedEvent(
  userAddress: Address,
  amount: BigInt
): ProtocolTokensClaimed {
  let protocolTokensClaimedEvent = changetype<ProtocolTokensClaimed>(
    newMockEvent()
  )

  protocolTokensClaimedEvent.parameters = new Array()

  protocolTokensClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "userAddress",
      ethereum.Value.fromAddress(userAddress)
    )
  )
  protocolTokensClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return protocolTokensClaimedEvent
}

export function createTimestampsUpdatedEvent(
  lgeStartTimestamp: BigInt,
  lgeEndTimestamp: BigInt,
  vestStartTimestamp: BigInt
): TimestampsUpdated {
  let timestampsUpdatedEvent = changetype<TimestampsUpdated>(newMockEvent())

  timestampsUpdatedEvent.parameters = new Array()

  timestampsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "lgeStartTimestamp",
      ethereum.Value.fromUnsignedBigInt(lgeStartTimestamp)
    )
  )
  timestampsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "lgeEndTimestamp",
      ethereum.Value.fromUnsignedBigInt(lgeEndTimestamp)
    )
  )
  timestampsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "vestStartTimestamp",
      ethereum.Value.fromUnsignedBigInt(vestStartTimestamp)
    )
  )

  return timestampsUpdatedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createVestModesUpdatedEvent(
  numVestModes: BigInt
): VestModesUpdated {
  let vestModesUpdatedEvent = changetype<VestModesUpdated>(newMockEvent())

  vestModesUpdatedEvent.parameters = new Array()

  vestModesUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "numVestModes",
      ethereum.Value.fromUnsignedBigInt(numVestModes)
    )
  )

  return vestModesUpdatedEvent
}

export function createVestStartTimestampUpdatedEvent(
  vestStartTimestamp: BigInt
): VestStartTimestampUpdated {
  let vestStartTimestampUpdatedEvent = changetype<VestStartTimestampUpdated>(
    newMockEvent()
  )

  vestStartTimestampUpdatedEvent.parameters = new Array()

  vestStartTimestampUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "vestStartTimestamp",
      ethereum.Value.fromUnsignedBigInt(vestStartTimestamp)
    )
  )

  return vestStartTimestampUpdatedEvent
}
