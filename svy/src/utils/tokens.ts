import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

/**
 * Convert svyBalance in USD value.
 * @param svyBalance The balance of SVY token.
 * @returns The USD value of svyBalance.
 */
export function getSvyBalanceInUSD(svyBalance: BigInt): BigDecimal {
  const svyPriceInUSD = BigDecimal.fromString("3");
  return svyBalance.toBigDecimal().times(svyPriceInUSD);
}