import { TypedMap } from "@graphprotocol/graph-ts";

function createSPM(syntheticType: string): TypedMap<string, string> {
  const map = new TypedMap<string, string>();
  map.set("contractType", "SavvyPositionManager");
  map.set("syntheticType", syntheticType);
  return map;
}

export const ADDRESS_TO_CONTRACTS_MAP: TypedMap<
  string,
  TypedMap<string, string>
> = new TypedMap<string, TypedMap<string, string>>();
ADDRESS_TO_CONTRACTS_MAP.set(
  "0x9e75782a9698cf5fb414d1e2865dfe6a9275ea4a",
  createSPM("BTC")
);
ADDRESS_TO_CONTRACTS_MAP.set(
  "0x088cac9aadcad94a59a1cbe8953a133ff438dc49",
  createSPM("ETH")
);
ADDRESS_TO_CONTRACTS_MAP.set(
  "0xcc86516537b414b4b5f14ce15dc94c6acb350e54",
  createSPM("USD")
);
