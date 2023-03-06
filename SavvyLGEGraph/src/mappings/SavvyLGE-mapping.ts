import { BigInt, Address } from '@graphprotocol/graph-ts'
import { SavvyLGE } from '../../generated/schema'
import { SavvyLGE as SavvyLGEContract } from '../../generated/SavvyLGE/SavvyLGE'
import { ethereum } from '@graphprotocol/graph-ts';

const DECIMALS_PT = BigInt.fromI32(18)
const DECIMALS_DT = BigInt.fromI32(6)

export function handleTotalProtocolToken(block: ethereum.Block): void {
  let contract = SavvyLGEContract.bind(Address.fromString('0x423B8bF2701efE7C496855FCD9c07fa75355bA11'))
  let totalProtocolToken = contract.totalProtocolToken()
  let totalDeposited = contract.totalDeposited()
  let totalDepositedInWei = totalDeposited.times(BigInt.fromI32(10).pow(12));
  let pricePerSvy = totalDeposited.gt(BigInt.fromI32(0)) ? totalProtocolToken.div(totalDepositedInWei) : BigInt.fromI32(0)

  // Create an entity to store the values of the variables
  let savvyLGE = new SavvyLGE('0x423B8bF2701efE7C496855FCD9c07fa75355bA11')
  savvyLGE.totalProtocolToken = totalProtocolToken.div(DECIMALS_PT)
  savvyLGE.totalDeposited = totalDeposited.div(DECIMALS_DT)
  savvyLGE.pricePerSvy = pricePerSvy.div(DECIMALS_PT)
  savvyLGE.save()
}