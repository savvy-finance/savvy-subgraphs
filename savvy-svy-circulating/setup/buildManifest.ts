import chalk from "chalk";
import { createSVYDataSource } from "./data-sources/SavvySVY";
import { createVeSVYDataSource } from "./data-sources/SavvyVeSVY";
import writeYamlFile from "write-yaml-file";
import {
  DataSourceConfig,
  Manifest,
  MANIFEST_PATH_TO_ROOT,
  NetworkConfig,
} from "./utils";

const abiToFunctionMap: Record<
  string,
  (network: string, config: DataSourceConfig) => Manifest
> = {
  SavvyProtocolToken: createSVYDataSource,
  SavvyVeSVY: createVeSVYDataSource,
};

function initializeManifest(manifestPathToRoot) {
  return {
    specVersion: "0.0.5",
    schema: {
      file: `${manifestPathToRoot}schema.graphql`,
    },
    dataSources: [],
  };
}

async function getNetworkConfig(network: string): Promise<NetworkConfig> {
  try {
    return (await import(`./config/${network}.json`)) as NetworkConfig;
  } catch (error) {
    console.log(
      `${chalk.red("Error:")} ${chalk.yellow(`Network ${network} not found.`)}`
    );
    throw error;
  }
}

function populateManifest(manifest: Manifest, config: NetworkConfig) {
  const { network, dataSources } = config;

  dataSources.forEach((dataSourceConfig) => {
    try {
      manifest.dataSources.push(
        abiToFunctionMap[dataSourceConfig.abi](network, dataSourceConfig)
      );
    } catch (error) {
      console.log(chalk.red(`Error: failed to add ${dataSourceConfig.name}`));
      console.log(error);
    }
  });

  return manifest;
}

async function writeManifestToFile(
  network: string,
  manifest: Manifest,
  path: string
) {
  try {
    await writeYamlFile(path, manifest);
    console.log(
      `${chalk.green(
        "Success!"
      )} Created Subgraph manifest at ${chalk.bold.yellow(path)}`
    );
  } catch (error) {
    console.log(chalk.red("Error: failed to write manifest to file"));
    console.log(error);
  }
}

async function main(network: string) {
  const manifest = initializeManifest(MANIFEST_PATH_TO_ROOT);
  const config = await getNetworkConfig(network);
  populateManifest(manifest, config);
  await writeManifestToFile(
    network,
    manifest,
    `./setup/manifest/subgraph.${network}.yaml`
  );

  const manifest1 = initializeManifest(MANIFEST_PATH_TO_ROOT);
  populateManifest(manifest1, config);
  await writeManifestToFile(network, manifest1, `./subgraph.yaml`);
}

main(process.argv.slice(2)[0])
  .then(() => {})
  .catch((error) => {
    console.log(chalk.red("Error: "));
    console.log(error);
  });
