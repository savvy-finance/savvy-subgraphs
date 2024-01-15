export const MANIFEST_PATH_TO_ROOT = "./";

export type Manifest = any;

export interface NetworkConfig {
  network: string;
  dataSources: DataSourceConfig[];
}

export interface DataSourceConfig {
  name: string;
  abi: string;
  address: string;
  startBlock: string;
}
