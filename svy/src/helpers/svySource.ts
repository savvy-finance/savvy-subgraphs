import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { SvySource } from "../../generated/schema";
import { BIGINT_ZERO, ZERO_ADDRESS } from "../constants";

export function getOrCreateSvySource(address: Address): SvySource {
  const id = address.toHexString();
  let svySource = SvySource.load(id);
  if (svySource === null) {
    svySource = new SvySource(id);
    svySource.totalSvyDistributed = BIGINT_ZERO;
    svySource.lastUpdatedBN = BIGINT_ZERO;
    svySource.lastUpdatedTimestamp = BIGINT_ZERO;
    svySource.save();
  }
  return svySource as SvySource;
}

export function increaseTotalSvyDistributed(
  accountAddress: Address,
  svyAmount: BigInt,
  block: ethereum.Block
): void {

  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return;
  }
  const svySource = getOrCreateSvySource(accountAddress);
  svySource.totalSvyDistributed = svySource.totalSvyDistributed.plus(svyAmount);
  svySource.lastUpdatedBN = block.number;
  svySource.lastUpdatedTimestamp = block.timestamp;
  svySource.save();
}