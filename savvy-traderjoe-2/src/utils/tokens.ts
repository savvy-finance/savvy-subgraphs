import { Address, log, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { BIGDECIMAL_TEN_TO_EIGHTEENTH, BIGDECIMAL_ZERO, BIGINT_TEN, SAVVY_PRICE_FEED, SV_BTC, SV_ETH, SV_USD } from "../constants";
import { SavvyPriceFeed } from "../../generated/TJ_LP_SVUSD/SavvyPriceFeed";

/**
 * Determines if an address is a Savvy synthetic.
 * @param address The address to check.
 * @returns Whether the address is a Savvy synthetic.
 */
export function isSavvySynthetic(address: string ): boolean {
  return address === SV_BTC || address === SV_ETH || address === SV_USD;
}

/**
 * Convert an amount of token to its USD value.
 * @param token The token you want to convert to USD.
 * @param amount The amount of the token you want to convert.
 * @returns The USD value of the token amount.
 */
export function getTokenValueInUSD(token: Address, amount: BigInt): BigDecimal {
  const savvyPriceFeed = SavvyPriceFeed.bind(Address.fromString(SAVVY_PRICE_FEED));
  const tokenToPrice = token.toHexString() === "0xaf88d065e77c8cc2239327c5edb3a432268e5831" ? Address.fromString("0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8") : token;
  const priceInUSD = savvyPriceFeed.try_getBaseTokenPrice(tokenToPrice, amount);
  if (priceInUSD.reverted) {
      log.warning("Failed to get USD value for token={} and amount={}", [tokenToPrice.toHexString(), amount.toString()]);
      return BIGDECIMAL_ZERO;
  }
  return (priceInUSD.value as BigInt).toBigDecimal().div(BIGDECIMAL_TEN_TO_EIGHTEENTH);
}

/**
 * Normalize BigInt to 18 decimals.
 * @throws error when decimals is greater than 18.
 * @param number The number you want to normalize. 
 * @param decimals The decimals of the number.
 * @returns The number normalized to 18 decimals.
 */
export function normalizeToEighteenDecimals(number: BigInt, decimals: number): BigInt {
  return number.times(BIGINT_TEN.pow(<u8>(18 - decimals)));
}