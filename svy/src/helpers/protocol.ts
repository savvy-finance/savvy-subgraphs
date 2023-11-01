import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";
import { BIGINT_ZERO, HEDGEY_CONFIGS, MULTISIG_CONFIGS, PROTOCOL_SLUG, TOTAL_SVY_SUPPLY } from "../constants";
import { getArbiscanContractCall, getSVYBalance, hexToBigInt, padHexadecimal } from "../utils/base";
import { createProtocolSnapshot } from "./protocol-snapshot";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load(PROTOCOL_SLUG);
  if (protocol === null) {
    protocol = new Protocol(PROTOCOL_SLUG);
    protocol.totalSVYHolders = 0;
    protocol.totalSVYStakers = 0;
    protocol.totalVeSVYHolders = 0;
    protocol.save();
  }
  return protocol as Protocol;
}

export function incrementSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYHolders += 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function decrementSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYHolders -= 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function incrementSVYStaker(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYStakers += 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function decrementSVYStaker(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalSVYStakers -= 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function incrementVeSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalVeSVYHolders += 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export function decrementVeSVYHolder(block: ethereum.Block): void {
  const protocol = getOrCreateProtocol();
  protocol.totalVeSVYHolders -= 1;
  protocol.save();
  createProtocolSnapshot(block, protocol);
}

export async function getCirculatingSVY(block: ethereum.Block): Promise<BigInt> {
  const timestampHex = block.timestamp.toHexString();
  const lockedSVYArr: BigInt[] = [];

  for (const config of HEDGEY_CONFIGS) {
    for (const id of config.ids) {
      const idHex = id.toString(16);
      const data = config.address === "0xd6e5E27F310C61633D331DBa585F7c55F579bbF6"
        ? config.functionHandle + padHexadecimal(idHex) + idHex
        : config.functionHandle
        + padHexadecimal(idHex) + idHex
        + padHexadecimal(timestampHex) + timestampHex
        + padHexadecimal(timestampHex) + timestampHex;
      const response = await getArbiscanContractCall(Address.fromHexString(config.address), data);
      if (response) {
        const lockedSVY = hexToBigInt(response.slice(67, 67 + 64));
        lockedSVYArr.push(lockedSVY);
      }
    }
  }

  for (const config of MULTISIG_CONFIGS) {
    const svyBalance = await getSVYBalance(Address.fromHexString(config.address));
    if (svyBalance) {
      lockedSVYArr.push(svyBalance);
    }
  }

  const totalLockedSVY = lockedSVYArr.reduce((sum, lockedSVY) => {
    return sum.plus(lockedSVY);
  }, BIGINT_ZERO);

  return TOTAL_SVY_SUPPLY.minus(totalLockedSVY);
}