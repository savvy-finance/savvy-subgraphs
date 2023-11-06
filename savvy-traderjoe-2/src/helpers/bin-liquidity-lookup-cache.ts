import { Address, BigInt } from "@graphprotocol/graph-ts";
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import { BinLiquidityLookupCache } from "../../generated/schema";

function binLiquidityLookupCacheId(
  lpAddress: Address | null,
  lbPair: LBPair | null,
  binId: BigInt,
  blockNumber: BigInt
): string {
  let id = "";
  if (lpAddress) {
    id = id.concat(lpAddress.toHexString());
  } else if (lbPair) {
    id = lbPair._address.toHexString();
  }
  id = id
    .concat("-")
    .concat(binId.toString())
    .concat("-")
    .concat(blockNumber.toString());
  return id;
}

export function getBinLiquidity(
  lpAddress: Address | null,
  lbPair: LBPair | null,
  binId: BigInt,
  blockNumber: BigInt
): BinLiquidityLookupCache {
  if (!lpAddress && !lbPair) {
    throw "[getBinLiquidity] Either `lpAddress` or `lbPair` must be set. Currently neither are set.";
  }

  const id = binLiquidityLookupCacheId(lpAddress, lbPair, binId, blockNumber);
  let binLiquidityLookupCache = BinLiquidityLookupCache.load(id);

  if (!binLiquidityLookupCache) {
    binLiquidityLookupCache = new BinLiquidityLookupCache(id);
    if (!lbPair) {
      lbPair = LBPair.bind(lpAddress!);
    }
    binLiquidityLookupCache.lpAddress = lbPair._address.toHexString();
    binLiquidityLookupCache.binId = binId;
    binLiquidityLookupCache.blocknumber = blockNumber;
    binLiquidityLookupCache.totalSupply = lbPair.totalSupply(binId);
    const reserves = lbPair.getBin(binId.toI32());
    binLiquidityLookupCache.reserveX = reserves.getBinReserveX();
    binLiquidityLookupCache.reserveY = reserves.getBinReserveY();
    binLiquidityLookupCache.save();
  }

  return binLiquidityLookupCache;
}
