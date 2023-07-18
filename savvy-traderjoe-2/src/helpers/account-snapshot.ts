import { Address, ethereum } from "@graphprotocol/graph-ts";
import { Account, AccountSnapshot } from "../../generated/schema";
import { BIGDECIMAL_ZERO, BIGINT_ZERO, QUARTERHOUR_IN_SECONDS } from "../constants";
import { getBeginOfThePeriodTimestamp } from "../utils/time";
import { getOrCreateAccount } from "./account";

export function getOrCreateAccountSnapshot(accountAddress: Address, block: ethereum.Block): AccountSnapshot {
  const snapshot = getBeginOfThePeriodTimestamp(block.timestamp, QUARTERHOUR_IN_SECONDS);
  const id = accountAddress.toHexString().concat('-').concat(snapshot.toString());
  let accountSnapshot = AccountSnapshot.load(id);
  if (!accountSnapshot) {
    accountSnapshot = new AccountSnapshot(id);
    accountSnapshot.account = accountAddress.toHexString();
    accountSnapshot.period = QUARTERHOUR_IN_SECONDS;
    accountSnapshot.timestamp = snapshot;
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

export function createAccountSnapshot(accountAddress: Address, block: ethereum.Block, account: Account | null): AccountSnapshot {
  const snapshot = getOrCreateAccountSnapshot(accountAddress, block);
  if (!account) {
    account = getOrCreateAccount(accountAddress);
  }
  
  snapshot.svUSD = account.svUSD;
  snapshot.USDC = account.USDC;
  snapshot.svUSDBinIds = account.svUSDBinIds;
  snapshot.svUSDLiquidityUSD = account.svUSDLiquidityUSD;
  snapshot.svETH = account.svETH;
  snapshot.WETH = account.WETH;
  snapshot.svETHBinIds = account.svETHBinIds;
  snapshot.svETHLiquidityUSD = account.svETHLiquidityUSD;
  snapshot.svBTC = account.svBTC;
  snapshot.WBTC = account.WBTC;
  snapshot.svBTCBinIds = account.svBTCBinIds;
  snapshot.svBTCLiquidityUSD = account.svBTCLiquidityUSD;
  snapshot.totalLiquidityUSD = account.totalLiquidityUSD;
  snapshot.save();
  return snapshot;
}