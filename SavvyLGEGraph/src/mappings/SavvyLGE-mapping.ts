import { BigInt, Address } from '@graphprotocol/graph-ts'
import { SavvyLGE } from '../../generated/schema'
import { SavvyLGE as SavvyLGEContract } from '../../generated/SavvyLGE/SavvyLGE'
import { ethereum } from '@graphprotocol/graph-ts';
import { contractAddress } from './contract';
const DECIMALS_PT = BigInt.fromI32(18)
const DECIMALS_DT = BigInt.fromI32(6)

export function handleCalculateSVYPrice(block: ethereum.Block): void {
  let contract = SavvyLGEContract.bind(Address.fromString(contractAddress))
  let totalProtocolToken = contract.totalProtocolToken()
  let totalDeposited = contract.totalDeposited()
  let totalDepositedInWei = totalDeposited.times(BigInt.fromI32(10).pow(12));
  let pricePerSvy = totalDeposited.gt(BigInt.fromI32(0)) ? totalProtocolToken.times(BigInt.fromI32(10).pow(18)).div(totalDepositedInWei) : BigInt.fromI32(0)

  // Create an entity to store the values of the variables
  let savvyLGE = new SavvyLGE(contractAddress)
  savvyLGE.totalProtocolToken = totalProtocolToken
  savvyLGE.totalDeposited = totalDeposited
  savvyLGE.pricePerSvy = pricePerSvy
  savvyLGE.timestamp = block.timestamp
  savvyLGE.save()
}