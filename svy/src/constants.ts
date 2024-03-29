import { Address, BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { SavvyProtocolToken } from "../generated/SavvyProtocolToken/SavvyProtocolToken";
import { StreamingHedgeys } from "../generated/SavvyProtocolToken/StreamingHedgeys";
import { TokenLockupPlans } from "../generated/SavvyProtocolToken/TokenLockupPlans";
import { TokenVestingPlans } from "../generated/SavvyProtocolToken/TokenVestingPlans";
import { SavvyFrontendInfoAggregator } from "../generated/veSVY/SavvyFrontendInfoAggregator";
import { veSVY } from "../generated/veSVY/veSVY";

/////////////////////////////
/// Addresses & Contracts ///
/////////////////////////////

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const SAVVY_PRICE_FEED = "0xbCDaB0382C17F58b828DB3AD840F0140C4f00156";
export const VESVY_CONTRACT_ADDRESS = "0x9aEEe4656F67034B06D99294062feBA1015430ad";
export const SFIA_CONTRACT_ADDRESS = "0x97DCA4000B2b89AFD926f5987ad7b054B3e39dB2";
export const SAVVY_PROTOCOL_TOKEN_ADDRESS = "0x43aB8f7d2A8Dd4102cCEA6b438F6d747b1B9F034";
export const STREAMING_HEDGEYS_CONTRACT_ADDRESS = "0xd6e5E27F310C61633D331DBa585F7c55F579bbF6";
export const TOKEN_LOCKUP_PLANS_CONTRACT_ADDRESS = "0x1B24CAe1De08ec8b3Ce0C55F9eE30Db747fd72aE";
export const TOKEN_VESTING_PLANS_CONTRACT_ADDRESS = "0xd240f76C57fB18196A864B8b06E9b168C98c4524";
export let CONTRACT_TO_NAME_MAP = new TypedMap<string, string>();

CONTRACT_TO_NAME_MAP.set("0x210c0856cd966fb8990b062488a18de778122329", "savvy-dao-arbitrum");
CONTRACT_TO_NAME_MAP.set("0xdcb178d47ab77e50f76381606e920454e730c998", "savvy-proxy-arbitrum");
CONTRACT_TO_NAME_MAP.set("0x4f54cab19b61138e3c622a0bd671c687481ec030", "savvy-treasury-arbitrum");
CONTRACT_TO_NAME_MAP.set("0x04e1e0b8b3cab90d586b94fcf2976a73365156a1", "savvy-admin-arbitrum");
CONTRACT_TO_NAME_MAP.set("0x4ff08f48a3fe2ce12b78b896a72d13bd5e9a0e32", "savvy-booster-arbitrum");
CONTRACT_TO_NAME_MAP.set("0x8f7c5539abefee5b860737a7f8bfa7bb1aa1dd1e", "savvy-mining-arbitrum");
CONTRACT_TO_NAME_MAP.set("0xc34da341a4ad2a40aa9282e692a500e023baabee", "savvy-ecosystem-arbitrum");
CONTRACT_TO_NAME_MAP.set("0xc6fc35bc3d83e9fce4f52a6dbe62e8227a6ac83e", "savvy-unvested-seed-arbitrum");
CONTRACT_TO_NAME_MAP.set("0xfd532461d2b080967a4827b066954a3e90b17d15", "savvy-unvested-team-arbitrum");
CONTRACT_TO_NAME_MAP.set("0xa7ccba432d1d4861098f155341644e96a492224c", "savvy-hold-team-arbitrum");
CONTRACT_TO_NAME_MAP.set("0x7754b5ccd22261c651f926b9eb8ee286f836cdd2", "savvy-peanut-admin-arbitrum");

export const MULTISIG_ADDRESSES = [
  "0xc6fc35Bc3D83e9fce4F52a6dbE62E8227A6ac83E",
  "0xfD532461d2B080967A4827b066954A3e90b17d15",
  "0xa7CcBA432d1D4861098F155341644E96A492224C"
];

export const SVYContract = SavvyProtocolToken.bind(Address.fromString(SAVVY_PROTOCOL_TOKEN_ADDRESS));
export const veSVYContract = veSVY.bind(Address.fromString(VESVY_CONTRACT_ADDRESS));
export const SFIAContract = SavvyFrontendInfoAggregator.bind(Address.fromString(SFIA_CONTRACT_ADDRESS));

export const streamingHedgeysContract = StreamingHedgeys.bind(Address.fromString(STREAMING_HEDGEYS_CONTRACT_ADDRESS));
export const tokenLockupPlansContract = TokenLockupPlans.bind(Address.fromString(TOKEN_LOCKUP_PLANS_CONTRACT_ADDRESS));
export const tokenVestingPlansContract = TokenVestingPlans.bind(Address.fromString(TOKEN_VESTING_PLANS_CONTRACT_ADDRESS));

//////////////
/// Others ///
//////////////

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_TEN_TO_EIGHTEENTH = BigInt.fromString("10").pow(18);

export const BIGDECIMAL_ZERO = BIGINT_ZERO.toBigDecimal();
export const BIGDECIMAL_TEN_TO_EIGHTEENTH = BIGINT_TEN_TO_EIGHTEENTH.toBigDecimal();

export const PROTOCOL_SLUG = "savvy-defi";

export const HOUR_IN_SECONDS = 60 * 60;
export const QUARTERHOUR_IN_SECONDS = 60 * 15;
export const TOTAL_SVY_SUPPLY = new BigInt(10_000_000).times(BIGINT_TEN_TO_EIGHTEENTH);
