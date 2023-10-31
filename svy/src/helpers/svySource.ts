import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { SVYSource } from "../../generated/schema";
import { BIGINT_ZERO, ZERO_ADDRESS } from "../constants";
import { createSVYSourceSnapshot } from "./svySource-snapshot";

export function getOrCreateSVYSource(address: Address): SVYSource {
  const id = address.toHexString();
  let svySource = SVYSource.load(id);
  if (svySource === null) {
    svySource = new SVYSource(id);
    svySource.totalSVYDistributed = BIGINT_ZERO;
    svySource.lastUpdatedBN = BIGINT_ZERO;
    svySource.lastUpdatedTimestamp = BIGINT_ZERO;
    svySource.save();
  }
  return svySource as SVYSource;
}

export function increaseTotalSVYDistributed(
  accountAddress: Address,
  svyAmount: BigInt,
  block: ethereum.Block
): void {

  if (accountAddress.toHexString() === ZERO_ADDRESS) {
    return;
  }
  const svySource = getOrCreateSVYSource(accountAddress);
  svySource.totalSVYDistributed = svySource.totalSVYDistributed.plus(svyAmount);
  svySource.lastUpdatedBN = block.number;
  svySource.lastUpdatedTimestamp = block.timestamp;
  svySource.save();
  createSVYSourceSnapshot(accountAddress, block, svySource);
}