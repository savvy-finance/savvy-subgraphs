import { Address, BigInt } from "@graphprotocol/graph-ts";
import axios from "axios";
import { ARBISCAN_API_KEY } from "../constants";

/**
 * Query read methods of a smart contract on arbitrum network through arbiscan API.
 * @param address The contract address to interact with
 * @param data The read method data to call
 * @returns The read method response
 */
export async function getArbiscanContractCall(address: Address, data: string): Promise<string | null> {
  try {
    const response = await axios.get(`https://api.arbiscan.io/api?module=proxy&action=eth_call&to=${address.toHexString()}&data=${data}&tag=latest&apikey=${ARBISCAN_API_KEY}`);
    return response.data as string;
  }
  catch (e) { }
  return null;
}

export async function getSVYBalance(address: Address): Promise<BigInt | null> {
  try {
    const response = await axios.get(`https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${"0x43aB8f7d2A8Dd4102cCEA6b438F6d747b1B9F034"}&address=${address.toHexString()}&tag=latest&apikey=${ARBISCAN_API_KEY}`);

    return hexToBigInt(response.data);
  }
  catch (e) { }
  return null;
}

/**
 * Pad zeros before a hexadecimal string to create a string of which length is 64
 * @param hexString The hexadecimal string
 * @returns The padded hexadecimal string
 */
export function padHexadecimal(hexString: string) {
  // Calculate the number of zeros needed to pad to a length of 64 characters
  const zerosCount = 64 - hexString.length;

  // Create a string of zeros
  const zeroPadding = '0'.repeat(zerosCount);

  // Concatenate the zero padding with the hex
  const paddedHexadecimal = zeroPadding + hexString;

  return paddedHexadecimal;
}

/**
 * Convert the hexadecimal string to BigInt
 * @param hexString The hexadecimal string to be converted
 * @returns The converted BigInt
 */
export function hexToBigInt(hexString: string) {
  // Remove any leading "0x" if it's present in the hex string
  if (hexString.startsWith("0x") || hexString.startsWith("0X")) {
    hexString = hexString.slice(2);
  }

  // Use parseInt with base 16 to convert the hexadecimal string to decimal
  const decimalValue = parseInt(hexString, 16);

  return new BigInt(decimalValue);
}

/**
 * Creates an array of integers between "start" and "end"
 * @param start The first integer to be started with
 * @param end The last integer to be ended with
 * @returns The array of integers
 */
export function createIntegerArray(start: number, end: number) {
  return Array.from(Array(end - start + 1), (_, index) => start + index);
}