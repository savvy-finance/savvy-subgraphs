# Savvy Protocol Subgraph

## Development

### Create subgraph manifest

The Subgraph manifests (found at `./setup/manifest/subgraph.{NETWORK}.yaml`) are dynamically built for each network. The build step is inspired by [Beefy's subgraph](https://github.com/messari/subgraphs/tree/master/subgraphs/beefy-finance/setup), which adheres to the [Messari standard](https://github.com/messari/subgraphs/tree/master).

| path | purpose |
| --- | --- |
| `./setup` | Contains the logic to build Subgraph manifests. |
| `./setup/buildManifest.ts` | The script that builds a subgraph manifest. |
| `./setup/config` | The network specific contract data. |
| `./setup/dataSources` | The template for specific data sources (e.g. the SavvyPositionManager data source). |
| `./setup/manifest` | The generated manifest. |

**Buiding Savvy's subgraph manifest**

To build a Savvy Subgraph Manifest, run `yarn build:manfiest {NETWORK_SLUG}`.

Supported networks include [`arbitrumGoerli`].

**Updating a subgraph manfiest**

To update a specific data source, navigate to `./setup/dataSources/{DATA_SOURCE}.ts`. This file contains the template for specific data sources.

**Using the subgraph manifest with The Graph CLI**

Run `yarn build:subgraph ./setup/manifest/subgraph.{NETWORK}.yaml`.