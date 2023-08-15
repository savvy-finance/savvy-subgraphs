import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { assert, beforeAll, describe, log, test } from "matchstick-as";
import { BIGINT_ZERO } from "../../src/constants";
import { decodeX, decodeY, getAmounts, convertSyntheticAmountToPairedAmount } from "../../src/utils/trader-joe";

describe("Test trader joe utils", () => {
  describe("Test `decodeX`", () => {
    test("non-zero decode", () => {
      const bytes = Bytes.fromHexString("0x0000000000000000000000000020B03600000000000000001DBCF5DE23279DB4");
      bytes.reverse();
      const expected = BigInt.fromString("2142857857142857140");
      const result = decodeX(bytes);
      assert.bigIntEquals(expected, result);
    });

    test("zero decode", () => {
      const bytes = Bytes.fromHexString("0x0000000000000000000000000020B03600000000000000000000000000000000");
      bytes.reverse();
      const expected = BIGINT_ZERO;
      const result = decodeX(bytes);
      assert.bigIntEquals(expected, result);
    });
  });

  describe("Test `decodeY`", () => {
    test("non-zero decode", () => {
      const bytes = Bytes.fromHexString("0x0000000000000000000000000020B03600000000000000001DBCF5DE23279DB4");
      bytes.reverse();
      const expected = BigInt.fromString("2142262");
      const result = decodeY(bytes);
      assert.bigIntEquals(expected, result);
    });

    test("zero decode", () => {
      const bytes = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000001DBCF5DE23279DB4");
      bytes.reverse();
      const expected = BIGINT_ZERO;
      const result = decodeY(bytes);
      assert.bigIntEquals(expected, result);
    });
  });

  describe("Test `getAmounts`", () => {
    test("non-zero amounts", () => {
      const bytes = [
        Bytes.fromHexString("0x0000000000000000000000000041607F00000000000000000000000000000000"),
        Bytes.fromHexString("0x0000000000000000000000000041607F00000000000000000000000000000000"),
        Bytes.fromHexString("0x0000000000000000000000000041607F00000000000000000000000000000000"),
        Bytes.fromHexString("0x0000000000000000000000000020B03600000000000000001DBCF5DE23279DB4"),
        Bytes.fromHexString("0x0000000000000000000000000000000000000000000000003B79EBBC464F3B69"),
        Bytes.fromHexString("0x0000000000000000000000000000000000000000000000003B79EBBC464F3B69"),
        Bytes.fromHexString("0x0000000000000000000000000000000000000000000000003B79EBBC464F3B69"),
      ];
      
      const result = getAmounts(bytes);
      log.info("reserve0={} reserve1={}", [result[0].toString(), result[1].toString()]);
      assert.bigIntEquals(BigInt.fromString("15000004999999999984"), result[0]);
      assert.bigIntEquals(BigInt.fromString("14995892"), result[1]);
    });
  });

  describe("Test `convertSyntheticAmountToPairedAmount`", () => {
    test("when binId is 8333335", () => {
      const binId = 8333335; // from svUSD TJ LP on 20230707
      const oneSvUSD = BigInt.fromString("1000000000000000000");
      const usdcDecimals = 6;
      const result = convertSyntheticAmountToPairedAmount(binId, oneSvUSD, usdcDecimals);
      const oneUSDC = BigInt.fromString("1000000");
      const oneCentUSDC = BigInt.fromString("10000");
      assert.assertTrue(result.minus(oneUSDC).lt(oneCentUSDC)); // close to 1 USDC (within 1 cent)
    });
  });
});