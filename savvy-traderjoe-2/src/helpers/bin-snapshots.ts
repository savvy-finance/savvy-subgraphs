import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Bin, BinSnapshot } from "../../generated/schema";
import { BIGINT_ZERO, QUARTERHOUR_IN_SECONDS } from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";

export function getOrCreateBinSnapshot(
  accountAddress: Address,
  lpAddress: Address,
  binId: BigInt,
  timestamp: BigInt
): BinSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(
    timestamp,
    QUARTERHOUR_IN_SECONDS
  );
  const id = `${accountAddress.toHexString()}-${lpAddress.toHexString()}-${binId.toString()}-${snapshot.toString()}`;
  let bin = BinSnapshot.load(id);
  if (!bin) {
    bin = new BinSnapshot(id);
    bin.account = accountAddress.toHexString();
    bin.lpAddress = lpAddress.toHexString();
    bin.binId = binId;
    bin.timestamp = snapshot;
    bin.period = QUARTERHOUR_IN_SECONDS;
    bin.tokenXBalance = BIGINT_ZERO;
    bin.tokenYBalance = BIGINT_ZERO;
    bin.save();
  }
  return bin as BinSnapshot;
}

export function createBinSnapshot(bin: Bin, timestamp: BigInt): BinSnapshot {
  const snapshot = getOrCreateBinSnapshot(
    Address.fromString(bin.account),
    Address.fromString(bin.lpAddress),
    bin.binId,
    timestamp
  );

  snapshot.tokenXBalance = bin.tokenXBalance;
  snapshot.tokenYBalance = bin.tokenYBalance;
  snapshot.save();
  return snapshot;
}

export function createBinSnapshotsFromBinIdArray(
  binIds: string[],
  timestamp: BigInt
): string[] {
  const snapshots: string[] = [];
  for (let i = 0; i < binIds.length; i++) {
    const binId = binIds[i];
    const bin = Bin.load(binId);
    if (!bin) {
      continue;
    }

    const snapshot = createBinSnapshot(bin, timestamp);
    snapshots.push(snapshot.id);
  }
  return snapshots;
}
