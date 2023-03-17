import { BigInt, Address } from '@graphprotocol/graph-ts'
import { AllotmentsPurchasedReceipt, SavvyLGEPriceData, UserPosition } from '../generated/schema';
import { AllotmentsBought, SavvyLGE as SavvyLGEContract } from '../generated/SavvyLGE/SavvyLGE'
import { ethereum } from '@graphprotocol/graph-ts';
import { contractAddress } from './contract';

export function handleAllotmentsBought(event: AllotmentsBought): void {
  saveSVYPriceData(event.block);
  syncUserPosition(event);
  saveAllotmentsPurchasedReceipt(event);
}

function saveSVYPriceData(block: ethereum.Block): void {

  const contract = SavvyLGEContract.bind(Address.fromString(contractAddress))

  const lgeEndTimestamp = contract.lgeEndTimestamp();
  if (block.timestamp > lgeEndTimestamp) {
    // Don't save data past end of LGE
    return;
  }

  const totalProtocolToken = contract.totalProtocolToken();
  const totalDeposited = contract.totalDeposited();
  const totalDepositedInWei = totalDeposited.times(BigInt.fromI32(10).pow(12));
  const pricePerSvy = totalDeposited.gt(BigInt.fromI32(0)) ? totalDepositedInWei.times(BigInt.fromI32(10).pow(18)).div(totalProtocolToken) : BigInt.fromI32(0);

  // Create an entity to store the values of the variables
  const savvyLGEPriceData = new SavvyLGEPriceData(block.timestamp.toString());
  savvyLGEPriceData.totalProtocolToken = totalProtocolToken;
  savvyLGEPriceData.totalDeposited = totalDeposited;
  savvyLGEPriceData.pricePerSvy = pricePerSvy;
  savvyLGEPriceData.timestamp = block.timestamp;
  savvyLGEPriceData.save();
}

function saveAllotmentsPurchasedReceipt(event: AllotmentsBought): void {
  const allotmentsPurchasedReceipt = new AllotmentsPurchasedReceipt(event.transaction.hash.toHexString());
  allotmentsPurchasedReceipt.address = event.params.userAddress.toHexString();
  allotmentsPurchasedReceipt.allotments = event.params.allotments;
  allotmentsPurchasedReceipt.deposited = event.params.deposited;
  allotmentsPurchasedReceipt.user = allotmentsPurchasedReceipt.address;
  allotmentsPurchasedReceipt.timestamp = event.block.timestamp;
  allotmentsPurchasedReceipt.save();
}

function syncUserPosition(event: AllotmentsBought): void {
  const userAddress = event.params.userAddress.toHexString();
  let user = UserPosition.load(userAddress);
  if (!user) {
    user = new UserPosition(userAddress);
    user.totalDeposited = BigInt.zero();
    user.totalAllotments = BigInt.zero();
  }
  user.totalDeposited = user.totalDeposited.plus(event.params.deposited);
  user.totalAllotments = user.totalAllotments.plus(event.params.allotments);
  user.save();
}