import { Token } from "../../generated/schema";
import { ERC20 } from '../../generated/LBPair/ERC20';
import { Address } from "@graphprotocol/graph-ts";
import { SV_BTC, SV_ETH, SV_USD } from "../constants";

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