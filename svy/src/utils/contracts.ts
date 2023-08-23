import { Address } from "@graphprotocol/graph-ts";
import { CONTRACT_TO_NAME_MAP } from "../constants";

export function getFriendlyName(address: Address): string | null {
  const hexString = address.toHexString();
  return CONTRACT_TO_NAME_MAP.get(hexString);
}