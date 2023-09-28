import { Entity, ethereum } from "@graphprotocol/graph-ts";
import { Block, Transaction } from "../../generated/schema";

export function getOrCreateBlock(rawBlock: ethereum.Block): Block {
  const id = rawBlock.hash.toHex();
  let block = Block.load(id);

  if (!block) {
    block = new Block(rawBlock.hash.toHex());
    block.number = rawBlock.number;
    block.hash = rawBlock.hash;
    block.timestamp = rawBlock.timestamp;
    block.save();
  }

  return block;
}

export function getOrCreateTransaction(
  rawTransaction: ethereum.Transaction,
  rawBlock: ethereum.Block
): Transaction {
  const id = rawTransaction.hash.toHex();
  let transaction = Transaction.load(id);

  if (!transaction) {
    const block = getOrCreateBlock(rawBlock);

    transaction = new Transaction(id);
    transaction.hash = rawTransaction.hash;
    transaction.input = rawTransaction.input;
    transaction.from = rawTransaction.from;
    transaction.to = rawTransaction.to;
    transaction.block = block.id;
    transaction.timestamp = block.timestamp;
    transaction.save();
  }

  return transaction;
}

export function createEvent<T extends Entity>(rawEvent: ethereum.Event): T {
  const block = getOrCreateBlock(rawEvent.block);
  const transaction = getOrCreateTransaction(
    rawEvent.transaction,
    rawEvent.block
  );

  const event = new Entity();
  event.setString(
    "id",
    rawEvent.transaction.hash.toHexString() + "-" + rawEvent.logIndex.toString()
  );
  event.setString("transaction", transaction.id);
  event.setI32("logIndex", rawEvent.logIndex.toI32());
  event.setString("block", block.id);
  event.setBigInt("timestamp", rawEvent.block.timestamp);

  return changetype<T>(event);
}
