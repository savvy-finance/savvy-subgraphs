import { BigInt } from "@graphprotocol/graph-ts";

export const SV_USD = "0xf202ab403cd7e90197ec0f010ee897e283037706";
export const SV_ETH = "0xf7728582002ef82908c8242cf552e969ba863ffa";
export const SV_BTC = "0xeee18334c414a47fb886a7317e1885b2bfb8c2a6";

export const TJ_LP_SVUSD = "0x3be852ff9f142783c71435524d63e2196e5f305a";
export const TJ_LP_SVETH = "0x2e14e24ec3efbd3b8c8976405351f8233d59650e"; 
export const TJ_LP_SVBTC = "0x830203b9a16920feb55d58d964ce83e1ba000269";
export const SAVVY_PRICE_FEED = "0xbCDaB0382C17F58b828DB3AD840F0140C4f00156";
export const LIQUIDITY_AMOUNTS_CONTRACT = "0x6277d122539110100fc2c78839c657033c294f64";

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_TWO = BigInt.fromI32(2);
export const BIGINT_TEN = BigInt.fromI32(10);
export const BIGINT_HUNDRED = BigInt.fromI32(100);
export const BIGINT_THOUSAND = BigInt.fromI32(1000);
export const BIGINT_TEN_TO_EIGHTEENTH = BigInt.fromString("10").pow(18);
export const BIGINT_MAX = BigInt.fromString(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
);

export const BIGDECIMAL_ZERO = BIGINT_ZERO.toBigDecimal();
export const BIGDECIMAL_TEN_TO_EIGHTEENTH = BIGINT_TEN_TO_EIGHTEENTH.toBigDecimal();

export const QUARTERHOUR_IN_SECONDS = 60 * 15;