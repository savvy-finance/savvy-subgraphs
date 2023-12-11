import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { BIGDECIMAL_TEN_TO_EIGHTEENTH } from "../constants";

/**
 * Convert svyBalance in USD value.
 * @param svyBalance The balance of SVY token.
 * @returns The USD value of svyBalance.
 */
export function getSVYBalanceInUSD(svyBalance: BigInt): BigDecimal {
  const svyPriceInUSD = BigDecimal.fromString("3");
  return svyBalance.toBigDecimal().times(svyPriceInUSD).div(BIGDECIMAL_TEN_TO_EIGHTEENTH);
}