import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index";
import { Address, Bytes, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { decodeX, decodeY, getAmounts } from "../src/helpers/trader-joe";
import { getPriceFromBinId } from '../src/helpers/pair';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  // beforeAll(() => {
  //   let account = Address.fromString(
  //     "0x0000000000000000000000000000000000000001"
  //   )
  //   let sender = Address.fromString(
  //     "0x0000000000000000000000000000000000000001"
  //   )
  //   let approved = "boolean Not implemented"
  //   let newApprovalForAllEvent = createApprovalForAllEvent(
  //     account,
  //     sender,
  //     approved
  //   )
  //   handleApprovalForAll(newApprovalForAllEvent)
  // })

  // afterAll(() => {
  //   clearStore()
  // })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TJ decodeX", () => {
    // let packedAmounts = Bytes.fromHexString("0x0000000000000000000000000020B03600000000000000001DBCF5DE23279DB4");
    // packedAmounts.reverse();
    // decodeX(packedAmounts);
    // decodeY(packedAmounts);

    const amounts = getAmounts([
      Bytes.fromHexString("0x0000000000000000000000000041607F00000000000000000000000000000000"),
      Bytes.fromHexString("0x0000000000000000000000000041607F00000000000000000000000000000000"),
      Bytes.fromHexString("0x0000000000000000000000000041607F00000000000000000000000000000000"),
      Bytes.fromHexString("0x0000000000000000000000000020B03600000000000000001DBCF5DE23279DB4"),
      Bytes.fromHexString("0x0000000000000000000000000000000000000000000000003B79EBBC464F3B69"),
      Bytes.fromHexString("0x0000000000000000000000000000000000000000000000003B79EBBC464F3B69"),
      Bytes.fromHexString("0x0000000000000000000000000000000000000000000000003B79EBBC464F3B69"),
    ]);
    log.debug("amounts={}", [amounts.toString()]);

    
    const BASE_BIN_PRICE = 1.0005;
    const BASE_BIN_ID = 8388608;
    // https://docs.traderjoexyz.com/guides/price-from-id
    // (1 + binStep / 10_000) ** (binId - 8388608)
    const priceFactor = 8388608 - BASE_BIN_ID;
    const price = BASE_BIN_PRICE ** priceFactor;
    const conversionFactor = 10**(18-6);
    const priceOfSyntheticInPairedAsset = BigDecimal.fromString(`${price * conversionFactor}`);
    const normalizedSyntheticInPairedAsset = amounts[0].toBigDecimal().times(priceOfSyntheticInPairedAsset);
    const syntheticInPairedAsset = normalizedSyntheticInPairedAsset.div(BigDecimal.fromString(`${conversionFactor}`));
    
    const tvlInPairedAsset = syntheticInPairedAsset.plus(amounts[1].toBigDecimal());

    log.debug("syntheticInPairedAsset={}", [syntheticInPairedAsset.toString()]);
    log.debug("tvlInPairedAsset={}", [tvlInPairedAsset.toString()]);
  });

  // test("ApprovalForAll created and stored", () => {
  //   assert.entityCount("ApprovalForAll", 1)

  //   // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
  //   assert.fieldEquals(
  //     "ApprovalForAll",
  //     "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
  //     "account",
  //     "0x0000000000000000000000000000000000000001"
  //   )
  //   assert.fieldEquals(
  //     "ApprovalForAll",
  //     "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
  //     "sender",
  //     "0x0000000000000000000000000000000000000001"
  //   )
  //   assert.fieldEquals(
  //     "ApprovalForAll",
  //     "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
  //     "approved",
  //     "boolean Not implemented"
  //   )

  //   // More assert options:
  //   // https://thegraph.com/docs/en/developer/matchstick/#asserts
  // })
})
