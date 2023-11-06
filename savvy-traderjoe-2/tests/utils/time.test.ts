import { BigInt } from "@graphprotocol/graph-ts";
import { assert, describe, log, test } from "matchstick-as";
import {
  QUARTERHOUR_IN_SECONDS,
  SV_BTC,
  SV_ETH,
  SV_USD,
} from "../../src/constants";
import { getBeginOfThePeriodTimestamp } from "../../src/utils/time";

describe("Test tokens utils", () => {
  test("Test `getBeginOfThePeriodTimestamp`", () => {
    const secondsSinceEpoch = BigInt.fromI32(1686686228);
    log.debug("secondsSinceEpoch: {}", [secondsSinceEpoch.toString()]);
    const period = QUARTERHOUR_IN_SECONDS;
    log.debug("period: {}", [period.toString()]);
    const expected = BigInt.fromI32(1686685500);
    log.debug("expected: {}", [expected.toString()]);
    const actual = getBeginOfThePeriodTimestamp(secondsSinceEpoch, period);
    log.debug("actual: {}", [actual.toString()]);
    assert.bigIntEquals(actual, expected);
  });
});
