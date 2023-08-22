import { Address, ethereum } from "@graphprotocol/graph-ts";
import { SvySource, SvySourceSnapshot } from "../../generated/schema";
import { BIGINT_ZERO, QUARTERHOUR_IN_SECONDS } from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { getOrCreateSvySource } from "./svySource";

export function getOrCreateSvySourceSnapshot(accountAddress: Address, block: ethereum.Block): SvySourceSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(block.timestamp, QUARTERHOUR_IN_SECONDS);
  const id = accountAddress.toHexString().concat('-').concat(snapshot.toString());
  let svySourceSnapshot = SvySourceSnapshot.load(id);
  if (!svySourceSnapshot) {
    svySourceSnapshot = new SvySourceSnapshot(id);
    svySourceSnapshot.svySource = accountAddress.toHexString();
    svySourceSnapshot.period = QUARTERHOUR_IN_SECONDS;
    svySourceSnapshot.timestamp = snapshot;
    svySourceSnapshot.totalSvyDistributed = BIGINT_ZERO;
    svySourceSnapshot.save();
  }

  return svySourceSnapshot;
}

export function createSvySourceSnapshot(
  accountAddress: Address,
  block: ethereum.Block,
  svySource: SvySource | null
): SvySourceSnapshot {
  const snapshot = getOrCreateSvySourceSnapshot(accountAddress, block);
  if (!svySource) {
    svySource = getOrCreateSvySource(accountAddress);
  }
  snapshot.totalSvyDistributed = svySource.totalSvyDistributed;
  snapshot.save();

  return snapshot;
}