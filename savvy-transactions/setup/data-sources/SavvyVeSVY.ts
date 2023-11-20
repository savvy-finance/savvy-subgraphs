import { DataSourceConfig, MANIFEST_PATH_TO_ROOT } from "../utils";

export function createVeSVYDataSource(
  network: string,
  config: DataSourceConfig
) {
  return {
    kind: "ethereum/contract",
    name: config.name,
    network: network,
    source: {
      address: config.address,
      abi: "VeSVY",
      startBlock: config.startBlock,
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.7",
      language: "wasm/assemblyscript",
      entities: [],
      abis: [
        {
          name: "VeSVY",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvyVeSvy.json`,
        },
        {
          name: "SavvyFrontendInfoAggregator",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvyFrontendInfoAggregator.json`,
        },
      ],
      eventHandlers: [
        {
          event: "Staked(indexed address,indexed address,indexed uint256)",
          handler: "handleStaked",
        },
        {
          event: "Unstaked(indexed address,indexed uint256)",
          handler: "handleUnstaked",
        },
        {
          event: "Claimed(indexed address,indexed uint256)",
          handler: "handleClaimed",
        },
      ],
      file: `${MANIFEST_PATH_TO_ROOT}src/mappings/savvy-ve-svy.ts`,
    },
  };
}
