import { BigInt } from "@graphprotocol/graph-ts";

/**
 * Pad zeros before a hexadecimal string to create a string of which length is 64
 * @param hexString The hexadecimal string
 * @returns The padded hexadecimal string
 */
export function padHexadecimal(hexString: string): string {
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
export function hexToBigInt(hexString: string): BigInt {
  // Remove any leading "0x" if it's present in the hex string
  if (hexString.startsWith("0x") || hexString.startsWith("0X")) {
    hexString = hexString.slice(2);
  }

  // Use parseInt with base 16 to convert the hexadecimal string to decimal
  const decimalValue = parseInt(hexString, 16);

  return new BigInt(decimalValue);
}

/**
 * Creates an array of BigInts between "start" and "end"
 * @param start The first integer to be started with
 * @param end The last integer to be ended with
 * @returns The array of BigInts
 */
export function createBigIntArray(start: number, end: number): BigInt[] {
  let arr: BigInt[] = [];
  for (let curr = start; curr <= end; ++curr) {
    arr.push(new BigInt(curr as i32));
  }
  return arr;
}