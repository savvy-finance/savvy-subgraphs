#!/bin/bash

if [ $# -eq 0 ]; then
  echo "Usage: $0 NETWORK"
  exit 1
fi

NETWORK=$1

# Run yarn build:manifest with the specified NETWORK
yarn build:manifest "$NETWORK"

# Run yarn build:manifest with the specified NETWORK
yarn build:schema

# Run yarn build:subgraph with the specified subgraph YAML file
yarn build:subgraph "./setup/manifest/subgraph.$NETWORK.yaml"
