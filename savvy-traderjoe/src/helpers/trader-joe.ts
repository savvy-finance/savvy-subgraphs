import { bigInt, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { BIGINT_ONE } from "../constants";


// https://docs.traderjoexyz.com/guides/tracking-pool-balances
// Assemblyscript API
// https://thegraph.com/docs/en/developing/assemblyscript-api/
export function getAmounts(amounts: Bytes[]): BigInt[] {
    let amountX:BigInt = BIGINT_ONE;
    let amountY:BigInt = BIGINT_ONE;
    for (let i=0; i < amounts.length; i++) {
      const _amounts = amounts[i]
      log.debug("RAMSsEY i={} amounts={}", [BigInt.fromI32(i).toString(), _amounts.toHexString()]);
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
    // log.debug("input={} mask={}", [BigInt.fromUnsignedBytes(packedAmounts).toHexString(), BigInt.fromI32(2).pow(128).minus(BigInt.fromI32(1)).toHexString()])
    const value = bigInt.bitAnd(BigInt.fromUnsignedBytes(packedAmounts), BigInt.fromI32(2).pow(128).minus(BigInt.fromI32(1)));
    log.debug("packedAmounts={} decodeX={} int={}", [packedAmounts.toHexString(), value.toHexString(), value.toString()]);
    return BigInt.fromUnsignedBytes(packedAmounts).bitAnd(BigInt.fromI32(2).pow(128).minus(BigInt.fromI32(1)));
  }
  
export function decodeY(packedAmounts: Bytes): BigInt {
    // Read the left 128 bits of the 256 bits
    log.debug("packedAmounts={} decodeY={} int={}", [packedAmounts.toHexString(), BigInt.fromUnsignedBytes(packedAmounts).rightShift(128).toHexString(), BigInt.fromUnsignedBytes(packedAmounts).rightShift(128).toString()]);
    return BigInt.fromUnsignedBytes(packedAmounts).rightShift(128)
  }