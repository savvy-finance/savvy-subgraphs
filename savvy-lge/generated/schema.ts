// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class SavvyLGEPriceData extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save SavvyLGEPriceData entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type SavvyLGEPriceData must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("SavvyLGEPriceData", id.toString(), this);
    }
  }

  static load(id: string): SavvyLGEPriceData | null {
    return changetype<SavvyLGEPriceData | null>(
      store.get("SavvyLGEPriceData", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get totalProtocolToken(): BigInt {
    let value = this.get("totalProtocolToken");
    return value!.toBigInt();
  }

  set totalProtocolToken(value: BigInt) {
    this.set("totalProtocolToken", Value.fromBigInt(value));
  }

  get totalDeposited(): BigInt {
    let value = this.get("totalDeposited");
    return value!.toBigInt();
  }

  set totalDeposited(value: BigInt) {
    this.set("totalDeposited", Value.fromBigInt(value));
  }

  get pricePerSvy(): BigInt {
    let value = this.get("pricePerSvy");
    return value!.toBigInt();
  }

  set pricePerSvy(value: BigInt) {
    this.set("pricePerSvy", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get totalAllotments(): BigInt {
    let value = this.get("totalAllotments");
    return value!.toBigInt();
  }

  set totalAllotments(value: BigInt) {
    this.set("totalAllotments", Value.fromBigInt(value));
  }
}

export class UserPosition extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserPosition entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserPosition must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserPosition", id.toString(), this);
    }
  }

  static load(id: string): UserPosition | null {
    return changetype<UserPosition | null>(store.get("UserPosition", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get totalDeposited(): BigInt {
    let value = this.get("totalDeposited");
    return value!.toBigInt();
  }

  set totalDeposited(value: BigInt) {
    this.set("totalDeposited", Value.fromBigInt(value));
  }

  get totalAllotments(): BigInt {
    let value = this.get("totalAllotments");
    return value!.toBigInt();
  }

  set totalAllotments(value: BigInt) {
    this.set("totalAllotments", Value.fromBigInt(value));
  }

  get purchases(): Array<string> {
    let value = this.get("purchases");
    return value!.toStringArray();
  }

  set purchases(value: Array<string>) {
    this.set("purchases", Value.fromStringArray(value));
  }
}

export class AllotmentsPurchasedReceipt extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save AllotmentsPurchasedReceipt entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type AllotmentsPurchasedReceipt must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("AllotmentsPurchasedReceipt", id.toString(), this);
    }
  }

  static load(id: string): AllotmentsPurchasedReceipt | null {
    return changetype<AllotmentsPurchasedReceipt | null>(
      store.get("AllotmentsPurchasedReceipt", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value!.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get address(): string {
    let value = this.get("address");
    return value!.toString();
  }

  set address(value: string) {
    this.set("address", Value.fromString(value));
  }

  get deposited(): BigInt {
    let value = this.get("deposited");
    return value!.toBigInt();
  }

  set deposited(value: BigInt) {
    this.set("deposited", Value.fromBigInt(value));
  }

  get allotments(): BigInt {
    let value = this.get("allotments");
    return value!.toBigInt();
  }

  set allotments(value: BigInt) {
    this.set("allotments", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}
