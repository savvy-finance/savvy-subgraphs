import { Address, BigDecimal, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import { BIGINT_MAX, BIGINT_ONE, BIGINT_ZERO, LIQUIDITY_AMOUNTS_CONTRACT } from "../constants";
import { getTokenValueInUSD } from "./tokens";

export function getLPPairInUSD(binId: number, syntheticAmount: BigInt, pairTokenAddress: Address, pairTokenAmount: BigInt, pairTokenDecimals: number): BigDecimal {
    const syntheticInPairedAmount = convertSyntheticAmountToPairedAmount(binId, syntheticAmount, pairTokenDecimals);
    const totalPairedAmount = syntheticInPairedAmount.plus(pairTokenAmount);
    const valueInUSD = getTokenValueInUSD(pairTokenAddress, totalPairedAmount);
    return valueInUSD;
}

const BASE_BIN_PRICE = 1.0005; // (1 + binStep / 10_000)
const BASE_BIN_ID = 8388608;
export function convertSyntheticAmountToPairedAmount(binId: number, syntheticAmount: BigInt, pairTokenDecimals: number): BigInt {
    // https://docs.traderjoexyz.com/guides/price-from-id
    // (1 + binStep / 10_000) ** (binId - 8388608)
    const priceFactor = binId - BASE_BIN_ID;
    const price = BASE_BIN_PRICE ** priceFactor;
    const conversionFactor = 10**(18-pairTokenDecimals);
    const priceOfSyntheticInPairedAsset = BigDecimal.fromString(`${price * conversionFactor}`);
    const normalizedSyntheticInPairedAsset = syntheticAmount.toBigDecimal().times(priceOfSyntheticInPairedAsset);
    const syntheticInPairedAsset = normalizedSyntheticInPairedAsset.div(BigDecimal.fromString(`${conversionFactor}`));
    return BigInt.fromString(syntheticInPairedAsset.toString().split('.')[0]);
}

/**
 * Get token balances across bins.
 * @param accountAddress The address of the account to get balances for.
 * @param lpAddress The address of the TJ liquidity pool.
 * @param binIds The bin IDs to get balances for.
 * @returns The balance of [token0, token1] in the given bin IDs for the account.
 */
export function getBalancesFromBinIds(accountAddress: Address, lpAddress: Address, binIds: BigInt[]): BigInt[] {
  const result = LIQUIDITY_AMOUNTS_CONTRACT.getAmountsOf(accountAddress, binIds, lpAddress);
  return [result.value0, result.value1];
  // const result = LIQUIDITY_AMOUNTS_CONTRACT.try_getAmountsOf(accountAddress, binIds, lpAddress);
  // if (result.reverted) {
  //   log.error("[getBalancesFromBinIds] getAmountsOf reverted -- account: {} lp: {} binIds: {}", [accountAddress.toHexString(), lpAddress.toHexString(), binIds.toString()]);
  //   return [BIGINT_MAX, BIGINT_MAX];
  // }
  // return [result.value.value0, result.value.value1];
}

// https://docs.traderjoexyz.com/guides/tracking-pool-balances
// Assemblyscript API
// https://thegraph.com/docs/en/developing/assemblyscript-api/
export function getAmounts(amounts: Bytes[]): BigInt[] {
    let amountX:BigInt = BIGINT_ONE;
    let amountY:BigInt = BIGINT_ONE;
    for (let i=0; i < amounts.length; i++) {
      const _amounts = amounts[i]
      // NOTE: reverse bytes to convert to big endianness
      _amounts.reverse()
      const _amountX = decodeX(_amounts);
      const _amountY = decodeY(_amounts);
      amountX = amountX.plus(_amountX);
      amountY = amountY.plus(_amountY);
    }
    return [amountX, amountY];
}

export function decodeX(packedAmounts: Bytes): BigInt {
  // Read the right 128 bits of the 256 bits
  return BigInt.fromUnsignedBytes(packedAmounts).bitAnd(BigInt.fromI32(2).pow(128).minus(BigInt.fromI32(1)));
}
  
export function decodeY(packedAmounts: Bytes): BigInt {
  // Read the left 128 bits of the 256 bits
  return BigInt.fromUnsignedBytes(packedAmounts).rightShift(128)
}

export function pruneBins(lbPair: LBPair, binIds: BigInt[]): BigInt[] {
  const prunedBinIds: BigInt[] = [];
  for (let i=0; i < binIds.length; i++) {
    const binSupply = lbPair.totalSupply(binIds[i]);
    if (binSupply.gt(BIGINT_ZERO)) {
      prunedBinIds.push(binIds[i]);
    }
  }
  return prunedBinIds;
}