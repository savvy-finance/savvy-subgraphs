import { Address } from '@graphprotocol/graph-ts';
import { Token } from '../../generated/schema';
import { ERC20 } from '../../generated/TJ_LP_SVUSD/ERC20';

export function getOrCreateToken(contractAddress: Address): Token {
  const id = contractAddress.toHexString();
  let token = Token.load(id);
  if (!token) {
      token = new Token(id);

      const erc20 = ERC20.bind(contractAddress);
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