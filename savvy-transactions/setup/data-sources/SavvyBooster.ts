import { DataSourceConfig, MANIFEST_PATH_TO_ROOT } from "../utils";

export function createSavvyBoosterDataSource(
  network: string,
  config: DataSourceConfig
) {
  return {
    kind: "ethereum/contract",
    name: config.name,
    network: network,
    source: {
      address: config.address,
      abi: "SavvyBooster",
      startBlock: config.startBlock,
    },
    mapping: {
      kind: "ethereum/events",
      apiVersion: "0.0.7",
      language: "wasm/assemblyscript",
      entities: [],
      abis: [
        {
          name: "SavvyBooster",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvyBooster.json`,
        },
        {
          name: "SavvyFrontendInfoAggregator",
          file: `${MANIFEST_PATH_TO_ROOT}abis/SavvyFrontendInfoAggregator.json`,
        },
      ],
      eventHandlers: [
        {
          event: "Deposit(uint256,uint256)",
          handler: "handleDeposit",
        },
        {
          event: "Withdraw(uint256)",
          handler: "handleWithdraw",
        },
        {
          event: "Claim(indexed address,uint256,uint256)",
          handler: "handleClaim",
        },
      ],
      file: `${MANIFEST_PATH_TO_ROOT}src/mappings/savvy-booster.ts`,
    },
  };
}
