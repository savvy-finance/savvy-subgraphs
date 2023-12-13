import { Address, BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { SavvyProtocolToken } from "../generated/SavvyProtocolToken/SavvyProtocolToken";
import { StreamingHedgeys } from "../generated/SavvyProtocolToken/StreamingHedgeys";
import { TokenLockupPlans } from "../generated/SavvyProtocolToken/TokenLockupPlans";
import { TokenVestingPlans } from "../generated/SavvyProtocolToken/TokenVestingPlans";

/////////////////////////////
/// Addresses & Contracts ///
/////////////////////////////

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const SAVVY_PROTOCOL_TOKEN_ADDRESS =
  "0x43aB8f7d2A8Dd4102cCEA6b438F6d747b1B9F034";
export const STREAMING_HEDGEYS_CONTRACT_ADDRESS =
  "0xd6e5E27F310C61633D331DBa585F7c55F579bbF6";
export const TOKEN_LOCKUP_PLANS_CONTRACT_ADDRESS =
  "0x1B24CAe1De08ec8b3Ce0C55F9eE30Db747fd72aE";
export const TOKEN_VESTING_PLANS_CONTRACT_ADDRESS =
  "0xd240f76C57fB18196A864B8b06E9b168C98c4524";

export const MULTISIG_ADDRESSES = [
  "0xc6fc35Bc3D83e9fce4F52a6dbE62E8227A6ac83E",
  "0xfD532461d2B080967A4827b066954A3e90b17d15",
  "0xa7CcBA432d1D4861098F155341644E96A492224C",
];

export const SVYContract = SavvyProtocolToken.bind(
  Address.fromString(SAVVY_PROTOCOL_TOKEN_ADDRESS)
);

export const streamingHedgeysContract = StreamingHedgeys.bind(
  Address.fromString(STREAMING_HEDGEYS_CONTRACT_ADDRESS)
);
export const tokenLockupPlansContract = TokenLockupPlans.bind(
  Address.fromString(TOKEN_LOCKUP_PLANS_CONTRACT_ADDRESS)
);
export const tokenVestingPlansContract = TokenVestingPlans.bind(
  Address.fromString(TOKEN_VESTING_PLANS_CONTRACT_ADDRESS)
);

//////////////
/// Others ///
//////////////

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_TEN_TO_EIGHTEENTH = BigInt.fromString("10").pow(18);

export const BIGDECIMAL_ZERO = BIGINT_ZERO.toBigDecimal();
export const BIGDECIMAL_TEN_TO_EIGHTEENTH =
  BIGINT_TEN_TO_EIGHTEENTH.toBigDecimal();

export const PROTOCOL_SLUG = "savvy-defi";

export const HOUR_IN_SECONDS = 60 * 60;
export const QUARTERHOUR_IN_SECONDS = 60 * 15;
export const TOTAL_SVY_SUPPLY = BigInt.fromI32(10_000_000).times(
  BIGINT_TEN_TO_EIGHTEENTH
);
