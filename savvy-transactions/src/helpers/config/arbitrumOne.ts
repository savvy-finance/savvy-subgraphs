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
  "0x3204d81C73F8100766C1691A67078b16Ec7c142c".toLowerCase(),
  createSPM("BTC")
);
ADDRESS_TO_CONTRACTS_MAP.set(
  "0x5c4eb1909fB21e39Fc45ee753420AeDeBA07F3EF".toLowerCase(),
  createSPM("ETH")
);
ADDRESS_TO_CONTRACTS_MAP.set(
  "0x36358A1597DB299033b16fda567010D53c0A4EdA".toLowerCase(),
  createSPM("USD")
);
