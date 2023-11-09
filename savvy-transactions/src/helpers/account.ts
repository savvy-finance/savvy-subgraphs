import { ethereum, Address, BigInt, Bytes, log, TypedMap } from "@graphprotocol/graph-ts";
import {
  Account,
  AccountSnapshot,
  AccountBalance,
  AccountBalanceSnapshot,
  Strategy,
  StrategyBalance,
  StrategyBalanceSnapshot,
} from "../../generated/schema";
import { SavvyFrontendInfoAggregator as SavvyFrontendInfoAggregatorContract } from "../../generated/SavvyPositionManagerUSD/SavvyFrontendInfoAggregator";
import { addUniqueUser, getSavvyDeFiOrCreate } from "./savvyDeFi";
import { ADDRESS_TO_CONTRACTS_MAP } from "./config/arbitrumOne";

export function getOrCreateAccountAndSnapshot(address: string, timestamp : BigInt): Account {
  let account = Account.load(address);
  if (!account) {
    account = new Account(address);
    account.totalDepositedUSD = BigInt.zero();
    account.totalDebtUSD = BigInt.zero();
    account.lastUpdatedTimestamp = timestamp;
    account.save();
    addUniqueUser();
  }
  return account;
}

export function getAccountBalanceId(
  account: Account,
  syntheticType: string
): string {
  return `${account.id}-${syntheticType}`;
}
export function getOrCreateAccountBalanceAndSnapshot(
  account: Account,
  syntheticType: string,
  timestamp : BigInt
): AccountBalance {
  const id = getAccountBalanceId(account, syntheticType);
  let accountBalance = AccountBalance.load(id);
  let accountBalanceSnapshot = new AccountBalanceSnapshot(`${id}-${timestamp}`);
  // accountBalanceSnapshot.
  if (!accountBalance) {
    accountBalance = new AccountBalance(id);
    accountBalance.account = account.id;
    accountBalance.syntheticType = syntheticType;
    accountBalance.debt = BigInt.zero();
    accountBalance.debtUSD = BigInt.zero();
    accountBalance.totalDepositedUSD = BigInt.zero();
    accountBalance.lastUpdatedTimestamp = timestamp;
    accountBalance.save();
  }
  return accountBalance;
}

export function getOrCreateStrategyAndSnapshot(
  strategyAddress: string,
  baseTokenAddress?: string
): Strategy {
  let strategy = Strategy.load(strategyAddress);
  if (!strategy) {
    strategy = new Strategy(strategyAddress);
    if (!baseTokenAddress) {
      baseTokenAddress = "";
    }
    strategy.baseTokenAddress = Bytes.fromHexString(baseTokenAddress);
    strategy.save();
  }
  return strategy;
}

export function getStrategyBalanceId(
  accountBalance: AccountBalance,
  strategy: Strategy
): string {
  return `${accountBalance.id}-${strategy.id}`;
}
export function getOrCreateStrategyBalance(
  accountBalance: AccountBalance,
  strategy: Strategy,
  timestamp : BigInt
): StrategyBalance {
  const id = getStrategyBalanceId(accountBalance, strategy);
  let strategyBalance = StrategyBalance.load(id);
  if (!strategyBalance) {
    strategyBalance = new StrategyBalance(id);
    strategyBalance.accountBalance = accountBalance.id;
    strategyBalance.strategy = strategy.id;
    strategyBalance.amountDeposited = BigInt.zero();
    strategyBalance.amountDepositedUSD = BigInt.zero();
    strategyBalance.lastUpdatedTimestamp = timestamp;
    strategyBalance.save();
  }
  return strategyBalance;
}

export function syncUserPosition(accountAddress: Address, event: ethereum.Event): Account {
  getSavvyDeFiOrCreate();
  const account = getOrCreateAccountAndSnapshot(accountAddress.toHexString(), event.block.timestamp);
  const savvyFrontendInfoAggregator = SavvyFrontendInfoAggregatorContract.bind(
    Address.fromString("0x97DCA4000B2b89AFD926f5987ad7b054B3e39dB2")
  );

  if (!savvyFrontendInfoAggregator) {
    return account;
  }

  const poolsPageInfoResult =
    savvyFrontendInfoAggregator.try_getPoolsPageInfo(accountAddress);
  log.debug("Daiki-1 = {}", [
    accountAddress.toHexString(),
  ]);
  if (poolsPageInfoResult.reverted) {
    log.warning("Failed to load pools page for account={}", [
      accountAddress.toHexString(),
    ]);
    return account;
  }
  const poolsPageInfo = poolsPageInfoResult.value;

  let totalDepositedUSD = BigInt.zero();
  let totalDebtUSD = BigInt.zero();
  const syntheticTypeToAccountBalanceMap = new TypedMap<
    string,
    AccountBalance
  >();
  log.debug("Daiki-11 = {}", [
    accountAddress.toHexString(),
  ]);
  for (let i = 0; i < poolsPageInfo.pools.length; i++) {
    const pool = poolsPageInfo.pools[i];
    const savvyPositionManagerAddress = pool.savvyPositionManager.toHexString();
    const contractDetails = ADDRESS_TO_CONTRACTS_MAP.get(
      savvyPositionManagerAddress
    );
    log.debug("Daiki-111 = {}", [
      accountAddress.toHexString(),
    ]);
    if (!contractDetails) {
      log.debug("Daiki-112 = {}, {}", [
        savvyPositionManagerAddress,
        accountAddress.toHexString(),
      ]);
      continue;
    }
    log.debug("Daiki-113 = {}", [
      accountAddress.toHexString(),
    ]);
    let syntheticType = contractDetails.get("syntheticType");
    if (!syntheticType) {
      log.debug("Daiki-114 = {}", [
        accountAddress.toHexString(),
      ]);
      continue;
    }
    log.debug("Daiki-115 = {}", [
      accountAddress.toHexString(),
    ]);
    syntheticType = syntheticType!;

    log.debug("Daiki-12 = {}", [
      accountAddress.toHexString(),
    ]);
    let accountBalance: AccountBalance;
    if (!syntheticTypeToAccountBalanceMap.isSet(syntheticType)) {
      accountBalance = getOrCreateAccountBalanceAndSnapshot(account, syntheticType, event.block.timestamp);
      accountBalance.totalDepositedUSD = BigInt.zero();
      syntheticTypeToAccountBalanceMap.set(syntheticType, accountBalance);
    } else {
      accountBalance = syntheticTypeToAccountBalanceMap.get(syntheticType)!;
    }

    log.debug("Daiki-13 = {}", [
      accountAddress.toHexString(),
    ]);
    const strategy = getOrCreateStrategyAndSnapshot(
      pool.poolAddress.toHexString(),
      pool.baseTokenAddress.toHexString()
    );
    const strategyBalance = getOrCreateStrategyBalance(
      accountBalance,
      strategy,
      event.block.timestamp
    );
    log.debug("Daiki-14 = {}", [
      accountAddress.toHexString(),
    ]);
    strategyBalance.amountDeposited = pool.userDepositedAmount;
    strategyBalance.amountDepositedUSD = pool.userDepositedValueUSD;
    accountBalance.totalDepositedUSD = accountBalance.totalDepositedUSD.plus(
      pool.userDepositedValueUSD
    );
    totalDepositedUSD = totalDepositedUSD.plus(pool.userDepositedValueUSD);

    log.debug("Daiki-15 = {}", [
      accountAddress.toHexString(),
    ]);
    strategy.save();
    strategyBalance.save();
  }

  for (let i = 0; i < poolsPageInfo.outstandingDebt.length; i++) {
    const outstandingDebt = poolsPageInfo.outstandingDebt[i];
    const contractDetails = ADDRESS_TO_CONTRACTS_MAP.get(
      outstandingDebt.savvyPositionManager.toHexString()
    );
    if (!contractDetails) {
      continue;
    }
    let syntheticType = contractDetails.get("syntheticType");
    if (!syntheticType) {
      continue;
    }
    syntheticType = syntheticType!;
    const accountBalance = syntheticTypeToAccountBalanceMap.get(syntheticType);
    if (!accountBalance) {
      continue;
    }
    accountBalance.debt = outstandingDebt.amount;
    accountBalance.debtUSD = outstandingDebt.valueUSD;
    accountBalance.save();
    totalDebtUSD = totalDebtUSD.plus(outstandingDebt.valueUSD);
  }

  log.debug("Daiki-2 = {}", [
    accountAddress.toHexString(),
  ]);
  log.debug("Daiki-3 = {}", [
    accountAddress.toHexString(),
  ]);
  account.totalDebtUSD = totalDebtUSD;
  account.totalDepositedUSD = totalDepositedUSD;
  account.save();
  return account;
}
