import { DataSourceConfig, MANIFEST_PATH_TO_ROOT } from "../utils";

export function createSVYDataSource(network: string, config: DataSourceConfig) {
  return {
    kind: "ethereum/contract",
    name: config.name,
    network: network,
    source: {
      address: config.address,
      abi: "SavvyProtocolToken",
      startBlock: config.startBlock,
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.7",
      language: "wasm/assemblyscript",
      entities: ["Account", "SVYSource", "Protocol"],
      abis: [
        {
          name: "SavvyProtocolToken",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvyProtocolToken.json`,
        },
        {
          name: "SavvyFrontendInfoAggregator",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvyFrontendInfoAggregator.json`,
        },
        {
          name: "StreamingHedgeys",
          file: `${MANIFEST_PATH_TO_ROOT}abis/StreamingHedgeys.json`,
        },
        {
          name: "TokenLockupPlans",
          file: `${MANIFEST_PATH_TO_ROOT}abis/TokenLockupPlans.json`,
        },
        {
          name: "TokenVestingPlans",
          file: `${MANIFEST_PATH_TO_ROOT}abis/TokenVestingPlans.json`,
        },
      ],
      eventHandlers: [
        {
          event: "Transfer(indexed address,indexed address,uint256)",
          handler: "handleTransfer",
        },
      ],
      file: `${MANIFEST_PATH_TO_ROOT}src/mappings/savvy-svy.ts`,
    },
  };
}
