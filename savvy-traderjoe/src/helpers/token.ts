import { Token } from "../../generated/schema";
import { ERC20 } from '../../generated/LBPair/ERC20';
import { Address, log, BigInt } from "@graphprotocol/graph-ts";
import { BIGINT_TEN, BIGINT_ZERO, SAVVY_PRICE_FEED, SV_BTC, SV_ETH, SV_USD } from "../constants";
import { SavvyPriceFeed } from "../../generated/TJ_LP_SVBTC/SavvyPriceFeed";

export function getOrCreateToken(contractAddress: string): Token {
    let token = Token.load(contractAddress);
    if (!token) {
        token = new Token(contractAddress);

        const erc20 = ERC20.bind(Address.fromString(contractAddress));
        const name = erc20.try_name();
        if (!name.reverted) {
            token.name = name.value;
        } else {
            token.name = "";
        }
        const symbol = erc20.try_symbol();
        if (!symbol.reverted) {
            token.symbol = symbol.value;
        } else {
            token.symbol = "";
        }
        const decimals = erc20.try_decimals();
        if (!decimals.reverted) {
            token.decimals = decimals.value;
        } else {
            token.decimals = 0;
        }
        token.save();
    }
    return token;
}

export function isSavvySynthetic(address: string ): boolean {
    return address === SV_BTC || address === SV_ETH || address === SV_USD;
}

export function getPriceUSD(token: string, amount: BigInt): BigInt {
    const savvyPriceFeed = SavvyPriceFeed.bind(Address.fromString(SAVVY_PRICE_FEED));
    const tokenToPrice = token == "0xaf88d065e77c8cc2239327c5edb3a432268e5831" ? "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8" : token;
    const priceInUSD = savvyPriceFeed.try_getBaseTokenPrice(Address.fromString(tokenToPrice), amount);
    if (priceInUSD.reverted) {
        log.warning("Failed to get TVL for token {}", [token]);
        return BIGINT_ZERO;
    }
    return priceInUSD.value;
}

export function normalize(amount: BigInt, decimals: number): BigInt {
    return amount.times(BIGINT_TEN.pow(<u8>(18 - decimals)));
}