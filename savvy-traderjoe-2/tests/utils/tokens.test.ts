import { BigInt } from "@graphprotocol/graph-ts";
import { assert, describe, test } from "matchstick-as";
import { SV_BTC, SV_ETH, SV_USD } from "../../src/constants";
import { isSavvySynthetic, normalizeToEighteenDecimals } from "../../src/utils/tokens";

describe("Test tokens utils", () => {
  describe("Test `normalizeToEighteenDecimals`", () => {
    test("less than 18 decimals", () => {
      const input = BigInt.fromString("1000000");
      const expected = BigInt.fromString("1000000000000000000");
      const result = normalizeToEighteenDecimals(input, 6);
      assert.bigIntEquals(result, expected);
    });

    test("0 decimals", () => {
      const input = BigInt.fromString("1");
      const expected = BigInt.fromString("1000000000000000000");
      const result = normalizeToEighteenDecimals(input, 0);
      assert.bigIntEquals(result, expected);
    });

    test("18 decimals", () => {
      const input = BigInt.fromString("1000000000000000000");
      const expected = BigInt.fromString("1000000000000000000");
      const result = normalizeToEighteenDecimals(input, 18);
      assert.bigIntEquals(result, expected);
    });
  })

  describe("Test `isSavvySynthetic`", () => {
    test("check svBTC", () => {
      assert.assertTrue(isSavvySynthetic(SV_BTC));
    });

    test("check svETH", () => {
      assert.assertTrue(isSavvySynthetic(SV_ETH));
    });

    test("check svUSD", () => {
      assert.assertTrue(isSavvySynthetic(SV_USD));
    });

    test("check non-synthetic", () => {
      assert.assertTrue(!isSavvySynthetic("0x000000"));
    });
  })
});