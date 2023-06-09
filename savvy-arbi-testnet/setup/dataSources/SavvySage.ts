import { DataSourceConfig, MANIFEST_PATH_TO_ROOT } from "../utils";

export function createSavvySageDataSource(network: string, config: DataSourceConfig) {
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
            ],
            eventHandlers: [
                {
                    event: "Deposit(indexed address, indexed address, uint256)",
                    handler: "handleDeposit",
                },
                {
                    event: "Withdraw(indexed address, indexed address, uint256)",
                    handler: "handleWithdraw",
                },
                {
                    event: "Claim(uint256, address)",
                    handler: "handleClaim",
                },
                {
                    event: "Swap(indexed address, uint256)",
                    handler: "handleSwap",
                },
            ],
            file: `${MANIFEST_PATH_TO_ROOT}subgraph/handlers/savvySage.ts`
        }
    }
}