import { Address, BigDecimal, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { LBPair } from "../../generated/TJ_LP_SVBTC/LBPair";
import { SavvyPriceFeed } from "../../generated/TJ_LP_SVBTC/SavvyPriceFeed";
import { Pair, PairHourlySnapshot, PairSnapshot, Token } from "../../generated/schema";
import { getBeginOfTheHourTimestamp, getBeginOfThePeriodTimestamp, getHoursSinceEpoch } from "../utils/time";
import { getOrCreateToken } from "./token";
import { SAVVY_PRICE_FEED, SV_BTC, SV_ETH, SV_USD, TJ_LP_SVBTC, TJ_LP_SVETH, TJ_LP_SVUSD } from "../constants";

const BASE_BIN_PRICE = 1.0005;
const BASE_BIN_ID = 8388608;
export function getPriceFromBinId(binId: number, reserve0: BigInt, token1: string, reserve1: BigInt, reserve1Decimals: number): BigInt {
    // https://docs.traderjoexyz.com/guides/price-from-id
    // (1 + binStep / 10_000) ** (binId - 8388608)
    const priceFactor = binId - BASE_BIN_ID;
    const price = BASE_BIN_PRICE ** priceFactor;
    const conversionFactor = 10**(18-reserve1Decimals);
    const priceOfSyntheticInPairedAsset = BigDecimal.fromString(`${price * conversionFactor}`);
    const normalizedSyntheticInPairedAsset = reserve0.toBigDecimal().times(priceOfSyntheticInPairedAsset);
    const syntheticInPairedAsset = normalizedSyntheticInPairedAsset.div(BigDecimal.fromString(`${conversionFactor}`));
    
    const tvlInPairedAsset = syntheticInPairedAsset.plus(reserve1.toBigDecimal());
    
    const savvyPriceFeed = SavvyPriceFeed.bind(Address.fromString(SAVVY_PRICE_FEED));
    const tokenToPrice = token1 == "0xaf88d065e77c8cc2239327c5edb3a432268e5831" ? "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8" : token1;
    const priceInUSD = savvyPriceFeed.try_getBaseTokenPrice(Address.fromString(tokenToPrice), BigInt.fromString(tvlInPairedAsset.toString().split('.')[0]));
    if (priceInUSD.reverted) {
        log.warning("Failed to get TVL for token {}", [token1]);
        return BigInt.zero();
    }
    return priceInUSD.value;
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
    let token1Pair: Token;
    if (!token1.reverted) {
        token1Pair = getOrCreateToken(token1.value.toHexString());
        pair.token1 = token1Pair.id;
    } else {
        pair.token1 = "";
    }
    const reserves = lbPair.try_getReserves();
    if (!reserves.reverted) {
        pair.reserve0 = reserves.value.value0;
        pair.reserve1 = reserves.value.value1;
        pair.reserve1Normalized = reserves.value.value1.times(BigInt.fromI64(10**(18-token1Pair.decimals)));
    } else {
        pair.reserve0 = BigInt.zero();
        pair.reserve1 = BigInt.zero();
        pair.reserve1Normalized = BigInt.zero();
    }

    pair.tvlUSD = getPriceFromBinId(lbPair.getActiveId(), pair.reserve0, token1Pair.id, pair.reserve1, token1Pair.decimals);

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
    snapshot.reserve1Normalized = pair.reserve1Normalized;
    snapshot.tvlUSD = pair.tvlUSD;

    const lastSnapshot = PairHourlySnapshot.load(`${contractAddress}-${hourSinceEpoch - 1}`);
    if (lastSnapshot) {
        snapshot.reserve0Delta = snapshot.reserve0.minus(lastSnapshot.reserve0);
        snapshot.reserve1Delta = snapshot.reserve1.minus(lastSnapshot.reserve1);
        snapshot.reserve1DeltaNormalized = snapshot.reserve1Normalized.minus(lastSnapshot.reserve1Normalized);
        snapshot.tvlUSDDelta = snapshot.tvlUSD.minus(lastSnapshot.tvlUSD);
    } else {
        snapshot.reserve0Delta = BigInt.zero();
        snapshot.reserve1Delta = BigInt.zero();
        snapshot.reserve1DeltaNormalized = BigInt.zero();
        snapshot.tvlUSDDelta = BigInt.zero();
    }

    snapshot.save();
    return snapshot;
}

export function createPairSnapshot(block: ethereum.Block, contractAddress: string, period: number): PairSnapshot {
    const pair = updatePair(block, contractAddress);

    const timestamp = getBeginOfThePeriodTimestamp(block.timestamp, period);
    const snapshotId = `${pair.id}-${period}-${timestamp}`;
    let snapshot = PairSnapshot.load(snapshotId);
    if (!snapshot) {
        snapshot = new PairSnapshot(snapshotId);
        snapshot.pair = pair.id;
        snapshot.period = period;
        snapshot.timestamp = getBeginOfTheHourTimestamp(block.timestamp);
    }

    snapshot.reserve0 = pair.reserve0;
    snapshot.reserve1 = pair.reserve1;
    snapshot.reserve1Normalized = pair.reserve1Normalized;
    snapshot.liquidityUSD = pair.tvlUSD;

    snapshot.save();
    return snapshot;
}

export function getLBPairFromSynthetic(synthetic: string): LBPair | null {
    if (synthetic === SV_BTC) {
        return LBPair.bind(Address.fromString(TJ_LP_SVBTC));
    } else if (synthetic === SV_ETH) {
        return LBPair.bind(Address.fromString(TJ_LP_SVETH));
    } else if (synthetic === SV_USD) {
        return LBPair.bind(Address.fromString(TJ_LP_SVUSD));
    }
    return null;
}