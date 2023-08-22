import { BigInt } from "@graphprotocol/graph-ts";

export const SAVVY_PRICE_FEED = "0xbCDaB0382C17F58b828DB3AD840F0140C4f00156";
export const VE_SVY = "0x9aEEe4656F67034B06D99294062feBA1015430ad";

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_TEN_TO_EIGHTEENTH = BigInt.fromString("10").pow(18);

export const BIGDECIMAL_ZERO = BIGINT_ZERO.toBigDecimal();
export const BIGDECIMAL_TEN_TO_EIGHTEENTH = BIGINT_TEN_TO_EIGHTEENTH.toBigDecimal();