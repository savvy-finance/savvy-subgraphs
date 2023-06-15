import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { LBPair } from "../../generated/LBPair/LBPair";
import { Pair, PairHourlySnapshot } from "../../generated/schema";
import { getBeginOfTheHourTimestamp, getHoursSinceEpoch } from "../utils/time";
import { getOrCreateToken } from "./token";

const BASE_BIN_PRICE = 1 + 5 / 10_000;
const BASE_BIN_ID = 8388608;
export function getTVLUSD(lbPair: LBPair, reserve0: BigInt, reserve1: BigInt, reserve1Decimals: number): BigDecimal {
    // https://docs.traderjoexyz.com/guides/price-from-id
    // (1 + binStep / 10_000) ** (binId - 8388608)
    const priceFactor = lbPair.getActiveId() - BASE_BIN_ID;
    const price = BASE_BIN_PRICE ** priceFactor;
    const conversionFactor = 10**(18-reserve1Decimals);
    const syntheticInPairedAsset = BigDecimal.fromString(`${price * conversionFactor}`);

    const tvlInPairedAsset = reserve0.toBigDecimal().times(syntheticInPairedAsset).plus(reserve1.toBigDecimal());
    return tvlInPairedAsset;
}

export function updatePair(block: ethereum.Block, contractAddress: string): Pair {
    let pair = Pair.load(contractAddress);
    if (!pair) {
        pair = new Pair(contractAddress);
    }
    const lbPair = LBPair.bind(Address.fromString(contractAddress));
    const token0 = lbPair.try_getTokenX();
    if (!token0.reverted) {
        const token0Pair = getOrCreateToken(token0.value.toHexString());
        pair.token0 = token0Pair.id;
    } else {
        pair.token0 = "";
    }
    const token1 = lbPair.try_getTokenY();
    let token1Decimals = 0;
    if (!token1.reverted) {
        const token1Pair = getOrCreateToken(token1.value.toHexString());
        pair.token1 = token1Pair.id;
        token1Decimals = token1Pair.decimals;
    } else {
        pair.token1 = "";
    }
    const reserves = lbPair.try_getReserves();
    if (!reserves.reverted) {
        pair.reserve0 = reserves.value.value0;
        pair.reserve1 = reserves.value.value1;
    } else {
        pair.reserve0 = BigInt.zero();
        pair.reserve1 = BigInt.zero();
    }

    pair.tvlUSD = getTVLUSD(lbPair, pair.reserve0, pair.reserve1, token1Decimals);

    pair.lastUpdatedBN = block.number;
    pair.save();
    return pair;
}

export function createPairHourlySnapshot(block: ethereum.Block, contractAddress: string): PairHourlySnapshot {
    const hourSinceEpoch = getHoursSinceEpoch(block.timestamp.toI32());
    const hourlySnapshotId = `${contractAddress}-${hourSinceEpoch}`;
    let snapshot = PairHourlySnapshot.load(hourlySnapshotId);
    const pair = updatePair(block, contractAddress);
    if (!snapshot) {
        snapshot = new PairHourlySnapshot(hourlySnapshotId);
        snapshot.pair = pair.id;
        snapshot.timestamp = getBeginOfTheHourTimestamp(block.timestamp);
    }

    snapshot.reserve0 = pair.reserve0;
    snapshot.reserve1 = pair.reserve1;
    snapshot.tvlUSD = pair.tvlUSD;

    const lastSnapshot = PairHourlySnapshot.load(`${contractAddress}-${hourSinceEpoch - 1}`);
    if (lastSnapshot) {
        snapshot.reserve0Delta = snapshot.reserve0.minus(lastSnapshot.reserve0);
        snapshot.reserve1Delta = snapshot.reserve1.minus(lastSnapshot.reserve1);
        snapshot.tvlUSDDelta = snapshot.tvlUSD.minus(lastSnapshot.tvlUSD);
    } else {
        snapshot.reserve0Delta = BigInt.zero();
        snapshot.reserve1Delta = BigInt.zero();
        snapshot.tvlUSDDelta = BigDecimal.zero();
    }

    snapshot.save();
    return snapshot;
}