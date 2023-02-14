import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { User } from "../generated/schema"
import { Approval as ApprovalEvent } from "../generated/AlchemixToken/AlchemixToken"
import { handleTransferALCX } from "../src/alchemix"
import { createTransferEvent } from "./alchemix-token-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  let from = Address.fromString("0x0000000000000000000000000000000000000000");
  let to = Address.fromString("0x0000000000000000000000000000000000000001");
  let other = Address.fromString("0x0000000000000000000000000000000000000002");
  let value = BigInt.fromI32(234);

  beforeAll(() => {
    let newTransferEvent = createTransferEvent(from, to, value)
    handleTransferALCX(newTransferEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("Transfer created and stored", () => {
    assert.entityCount("User", 1)

    assert.fieldEquals(
      "User",
      to.toHexString(),
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Approval",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "value",
      "234"
    )
  })
})
