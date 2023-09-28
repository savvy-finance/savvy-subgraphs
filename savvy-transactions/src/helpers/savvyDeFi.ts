import { dataSource } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";
import {
  BIGDECIMAL_ZERO,
  ProtocolType,
  PROTOCOL_NAME,
  PROTOCOL_SLUG,
} from "../common/constants";

export function getSavvyDeFiOrCreate(): Protocol {
  let savvy = Protocol.load(PROTOCOL_SLUG);
  if (!savvy) {
    savvy = new Protocol(PROTOCOL_SLUG);
    savvy.name = PROTOCOL_NAME;
    savvy.slug = PROTOCOL_SLUG;
    savvy.network = dataSource.network().toUpperCase().replace("-", "_");
    savvy.type = ProtocolType.LENDING;
    savvy.totalValueLockedUSD = BIGDECIMAL_ZERO;
    savvy.protocolControlledValueUSD = BIGDECIMAL_ZERO;
    savvy.cumulativeSupplySideRevenueUSD = BIGDECIMAL_ZERO;
    savvy.cumulativeProtocolSideRevenueUSD = BIGDECIMAL_ZERO;
    savvy.cumulativeTotalRevenueUSD = BIGDECIMAL_ZERO;
    savvy.cumulativeUniqueUsers = 0;

    // TODO figure out Versions
    savvy.schemaVersion = "0"; // Versions.getSchemaVersion();
    savvy.subgraphVersion = "0"; // Versions.getSubgraphVersion();
    savvy.methodologyVersion = "0"; // Versions.getMethodologyVersion();
    savvy.save();
  }

  return savvy;
}

export function addUniqueUser(): void {
  const savvy = getSavvyDeFiOrCreate();
  savvy.cumulativeUniqueUsers = savvy.cumulativeUniqueUsers + 1;
  savvy.save();
}
