import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { AllotmentsBought } from "../generated/SavvyLGE/SavvyLGE"
import { handleAllotmentsBought } from "../src/savvy-lge"
import { createAllotmentsBoughtEvent } from "./savvy-lge-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  test("handles allotments", () => {
    const decode = ethereum.decode("DepositYieldToken(indexed address,indexed address,uint256,address)", Bytes.fromHexString("0xc20e4d85000000000000000000000000be0b03dca3d8da085140ec82954168aa98f87b5200000000000000000000000000000000000000000000003635c9adc64d178b0f000000000000000000000000000000000000000000000000000000000000000a"));
    console.log(decode === null ? "decode is null" : decode.toString());
  })

  afterAll(() => {
    clearStore()
  })
})
