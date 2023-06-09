import chalk from "chalk";
import { createSavvyPositionManagerDataSource } from "./dataSources/SavvyPositionManager";
import { createSavvySageDataSource } from "./dataSources/SavvySage";
import { createSavvySwapDataSource } from "./dataSources/SavvySwap";
import writeYamlFile from 'write-yaml-file';
import { DataSourceConfig, Manifest, NetworkConfig } from "./utils";

const abiToFunctionMap: Record<string, (network: string, config: DataSourceConfig) => Manifest> = {
    "SavvySwap": createSavvySwapDataSource,
    "SavvySage": createSavvySageDataSource,
    "SavvyPositionManager": createSavvyPositionManagerDataSource,
}

function initializeManifest() {
    return {
        specVersion: "0.1.20230608",
        schema: {
          file: "./schema.graphql",
        },
        dataSources: [],
    };
}

async function getNetworkConfig(network: string): Promise<NetworkConfig> {
    try {
        return (await import(`./config/${network}.json`)) as NetworkConfig;
    } catch (error) {
        console.log(`${chalk.red("Error:")} ${chalk.yellow(`Network ${network} not found.`)}`)
        throw error;
    }
}

function populateManifest(manifest: Manifest, config: NetworkConfig) {
    const { network, dataSources } = config;

    dataSources.forEach((dataSourceConfig) => {
        try {
            manifest.dataSources.push(abiToFunctionMap[dataSourceConfig.abi](network, dataSourceConfig));
        } catch (error) {
            console.log(chalk.red(`Error: failed to add ${dataSourceConfig.name}`));
            console.log(error);
        }
    });

    return manifest;
}

async function writeManifestToFile(network: string, manifest: Manifest) {
    try {
        const path = `./setup/manifest/subgraph.${network}.yaml`;
        await writeYamlFile(path, manifest);
        console.log(`${chalk.green("Success!")} Created Subgraph manifest at ${chalk.bold.yellow(path)}`);
    } catch (error) {
        console.log(chalk.red("Error: failed to write manifest to file"));
        console.log(error);
    }
}

async function main(network: string) {
    const manifest = initializeManifest();
    const config = await getNetworkConfig(network);
    populateManifest(manifest, config);
    await writeManifestToFile(network, manifest);
}

main(process.argv.slice(2)[0])
    .then(() => {
    })
    .catch((error) => {
        console.log(chalk.red("Error: "));
        console.log(error);
    });