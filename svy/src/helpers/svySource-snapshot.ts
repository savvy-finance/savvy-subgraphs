import { Address, ethereum } from "@graphprotocol/graph-ts";
import { SVYSource, SVYSourceSnapshot } from "../../generated/schema";
import { BIGINT_ZERO, QUARTERHOUR_IN_SECONDS } from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { getOrCreateSVYSource } from "./svySource";

export function getOrCreateSVYSourceSnapshot(accountAddress: Address, block: ethereum.Block): SVYSourceSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(block.timestamp, QUARTERHOUR_IN_SECONDS);
  const id = accountAddress.toHexString().concat('-').concat(snapshot.toString());
  let svySourceSnapshot = SVYSourceSnapshot.load(id);
  if (!svySourceSnapshot) {
    svySourceSnapshot = new SVYSourceSnapshot(id);
    svySourceSnapshot.svySource = accountAddress.toHexString();
    svySourceSnapshot.period = QUARTERHOUR_IN_SECONDS;
    svySourceSnapshot.timestamp = snapshot;
    svySourceSnapshot.totalSVYDistributed = BIGINT_ZERO;
    svySourceSnapshot.save();
  }

  return svySourceSnapshot;
}

export function createSVYSourceSnapshot(
  accountAddress: Address,
  block: ethereum.Block,
  svySource: SVYSource | null
): SVYSourceSnapshot {
  const snapshot = getOrCreateSVYSourceSnapshot(accountAddress, block);
  if (!svySource) {
    svySource = getOrCreateSVYSource(accountAddress);
  }
  snapshot.totalSVYDistributed = svySource.totalSVYDistributed;
  snapshot.save();

  return snapshot;
}