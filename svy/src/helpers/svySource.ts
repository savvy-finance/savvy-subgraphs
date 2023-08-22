import { Address } from "@graphprotocol/graph-ts";
import { SvySource } from "../../generated/schema";
import { BIGINT_ZERO } from "../constants";

export function getOrCreateSvySource(address: Address): SvySource {
  const id = address.toHexString();
  let svySource = SvySource.load(id);
  if (svySource === null) {
    svySource = new SvySource(id);
    svySource.totalSvyDistributed = BIGINT_ZERO;
    svySource.lastUpdatedBN = BIGINT_ZERO;
    svySource.lastUpdatedTimestamp = BIGINT_ZERO;
    svySource.save();
  }
  return svySource as SvySource;
}