import { DataSourceConfig, MANIFEST_PATH_TO_ROOT } from "../utils";

export function createSavvySageDataSource(
  network: string,
  config: DataSourceConfig
) {
  return {
    kind: "ethereum/contract",
    name: config.name,
    network: network,
    source: {
      address: config.address,
      abi: "SavvySage",
      startBlock: config.startBlock,
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.7",
      language: "wasm/assemblyscript",
      entities: [],
      abis: [
        {
          name: "SavvySage",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvySage.json`,
        },
        {
          name: "SavvyFrontendInfoAggregator",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvyFrontendInfoAggregator.json`,
        },
      ],
      eventHandlers: [
        {
          event: "SetFlowRate(address,uint256)",
          handler: "handleSetFlowRateEvent",
        },
      ],
      file: `${MANIFEST_PATH_TO_ROOT}src/mappings/savvySage.ts`,
    },
  };
}
