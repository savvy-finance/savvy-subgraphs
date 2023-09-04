import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Account, AccountSnapshot } from "../../generated/schema";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  QUARTERHOUR_IN_SECONDS,
} from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { getOrCreateAccount } from "./account";
import { createBinSnapshotsFromBinIdArray } from "./bin-snapshots";

export function getOrCreateAccountSnapshot(
  accountAddress: Address,
  timestamp: BigInt
): AccountSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(
    timestamp,
    QUARTERHOUR_IN_SECONDS
  );
  const id = accountAddress
    .toHexString()
    .concat("-")
    .concat(snapshot.toString());
  let accountSnapshot = AccountSnapshot.load(id);
  if (!accountSnapshot) {
    accountSnapshot = new AccountSnapshot(id);
    accountSnapshot.account = accountAddress.toHexString();
    accountSnapshot.period = QUARTERHOUR_IN_SECONDS;
    accountSnapshot.timestamp = snapshot;
    accountSnapshot.svy = BIGINT_ZERO;
    accountSnapshot.svyWETH = BIGINT_ZERO;
    accountSnapshot.svyBinIds = [];
    accountSnapshot.svyLiquidityUSD = BIGDECIMAL_ZERO;
    accountSnapshot.svUSD = BIGINT_ZERO;
    accountSnapshot.USDC = BIGINT_ZERO;
    accountSnapshot.svUSDBinIds = [];
    accountSnapshot.svUSDLiquidityUSD = BIGDECIMAL_ZERO;
    accountSnapshot.svETH = BIGINT_ZERO;
    accountSnapshot.WETH = BIGINT_ZERO;
    accountSnapshot.svETHBinIds = [];
    accountSnapshot.svETHLiquidityUSD = BIGDECIMAL_ZERO;
    accountSnapshot.svBTC = BIGINT_ZERO;
    accountSnapshot.WBTC = BIGINT_ZERO;
    accountSnapshot.svBTCBinIds = [];
    accountSnapshot.svBTCLiquidityUSD = BIGDECIMAL_ZERO;
    accountSnapshot.totalLiquidityUSD = BIGDECIMAL_ZERO;
    accountSnapshot.save();
  }

  return accountSnapshot;
}

export function createAccountSnapshot(
  accountAddress: Address,
  timestamp: BigInt,
  account: Account | null
): AccountSnapshot {
  const snapshot = getOrCreateAccountSnapshot(accountAddress, timestamp);
  if (!account) {
    account = getOrCreateAccount(accountAddress);
  }

  snapshot.svUSD = account.svUSD;
  snapshot.USDC = account.USDC;
  snapshot.svy = account.svy;
  snapshot.svyWETH = account.svyWETH;
  snapshot.svyBinIds = createBinSnapshotsFromBinIdArray(
    account.svyBinIds,
    timestamp
  );
  snapshot.svyLiquidityUSD = account.svyLiquidityUSD;
  snapshot.svUSDBinIds = createBinSnapshotsFromBinIdArray(
    account.svUSDBinIds,
    timestamp
  );
  snapshot.svUSDLiquidityUSD = account.svUSDLiquidityUSD;
  snapshot.svETH = account.svETH;
  snapshot.WETH = account.WETH;
  snapshot.svETHBinIds = createBinSnapshotsFromBinIdArray(
    account.svETHBinIds,
    timestamp
  );
  snapshot.svETHLiquidityUSD = account.svETHLiquidityUSD;
  snapshot.svBTC = account.svBTC;
  snapshot.WBTC = account.WBTC;
  snapshot.svBTCBinIds = createBinSnapshotsFromBinIdArray(
    account.svBTCBinIds,
    timestamp
  );
  snapshot.svBTCLiquidityUSD = account.svBTCLiquidityUSD;
  snapshot.totalLiquidityUSD = account.totalLiquidityUSD;
  snapshot.save();
  return snapshot;
}
