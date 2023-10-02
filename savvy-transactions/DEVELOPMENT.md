# Savvy Protocol Subgraph

## Getting started

1. Run `npm run build {NETWORK}` to generate the manifest, graphql schema, and the subgraph wasm.
1. Run `npm run codegen` to generate entities.

## Create subgraph manifest

The Subgraph manifests (found at `./setup/manifest/subgraph.{NETWORK}.yaml`) are dynamically built for each network. The build step is inspired by [Beefy's subgraph](https://github.com/messari/subgraphs/tree/master/subgraphs/beefy-finance/setup), which adheres to the [Messari standard](https://github.com/messari/subgraphs/tree/master).

| path                       | purpose                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `./setup`                  | Contains the logic to build Subgraph infrastructure.                                |
| `./setup/buildManifest.ts` | The script that builds a subgraph manifest.                                         |
| `./setup/config`           | The network specific contract data.                                                 |
| `./setup/dataSources`      | The template for specific data sources (e.g. the SavvyPositionManager data source). |
| `./setup/manifest`         | The generated manifest.                                                             |

### Buiding Savvy's subgraph manifest

To build a Savvy Subgraph Manifest, run `npm run build:manfiest {NETWORK_SLUG}`.

Supported networks include [`arbitrumGoerli`].

### Updating a subgraph manfiest

To update a specific data source, navigate to `./setup/dataSources/{DATA_SOURCE}.ts`. This file contains the template for specific data sources.

## Create schema.graphql

The `schema.graphql` is dynamically generated. Breaking up the schema allows for more manageable code.

| path                     | purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `./setup`                | Contains the logic to build Subgraph infrastructure.     |
| `./setup/buildSchema.ts` | The script that builds the `schema.graphql`.             |
| `./setup/schemas`        | The different schemas used to assemble `schema.graphql`. |
| `./schema.graphql`       | The generated schema.                                    |

### Assembling `schema.graphql`

Running `npm run build:schema` will overwrite `./schema.graphql` by assmebling the schemas in `./setup/schemas`.

`buildSchema.ts` has an array that determines the order of files to assemble.
