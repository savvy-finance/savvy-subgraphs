import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Bin } from "../../generated/schema";
import { LBPair } from "../../generated/TJ_LP_SVUSD/LBPair";
import { BIGINT_ZERO } from "../constants";
import { normalizeToEighteenDecimals } from "../utils/tokens";
import {
  getAmounts,
  getBalancesFromBinIds,
  getBalancesFromBinIds2,
} from "../utils/trader-joe";

export function getOrCreateBin(
  accountAddress: Address,
  lpAddress: Address,
  binId: BigInt
): Bin {
  const id = `${accountAddress.toHexString()}-${lpAddress.toHexString()}-${binId.toString()}`;
  let bin = Bin.load(id);
  if (!bin) {
    bin = new Bin(id);
    bin.account = accountAddress.toHexString();
    bin.lpAddress = lpAddress.toHexString();
    bin.binId = binId;
    bin.tokenXBalance = BIGINT_ZERO;
    bin.tokenYBalance = BIGINT_ZERO;
    bin.save();
  }
  return bin as Bin;
}

export function refreshBinBalances(
  account: Address,
  binId: string,
  lbPair: LBPair,
  tokenYDecimals: number
): Bin | null {
  const bin = Bin.load(binId);

  if (!bin) {
    return null;
  }

  const binSupply = lbPair.totalSupply(bin.binId);
  if (binSupply === BIGINT_ZERO) {
    bin.tokenXBalance = BIGINT_ZERO;
    bin.tokenYBalance = BIGINT_ZERO;
  } else {
    const amounts = getBalancesFromBinIds2(account, lbPair, [bin.binId]);
    bin.tokenXBalance = amounts[0];
    bin.tokenYBalance = normalizeToEighteenDecimals(amounts[1], tokenYDecimals);
  }
  bin.save();
  return bin;
}
