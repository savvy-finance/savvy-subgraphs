import { DataSourceConfig, MANIFEST_PATH_TO_ROOT } from "../utils";

export function createSVYDataSource(network: string, config: DataSourceConfig) {
  return {
    kind: "ethereum/contract",
    name: config.name,
    network: network,
    source: {
      address: config.address,
      abi: "SVY",
      startBlock: config.startBlock,
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.7",
      language: "wasm/assemblyscript",
      entities: [],
      abis: [
        {
          name: "SVY",
          file: `${MANIFEST_PATH_TO_ROOT}abis/ERC20.json`,
        },
      ],
      eventHandlers: [
        {
          event: "Transfer(indexed address,indexed address,uint256)",
          handler: "handleTransferred",
        },
      ],
      file: `${MANIFEST_PATH_TO_ROOT}src/mappings/savvy-svy.ts`,
    },
  };
}
