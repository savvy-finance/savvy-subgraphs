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
// import { addUniqueUser, getSavvyDeFiOrCreate } from "./savvyDeFi";
import { ADDRESS_TO_CONTRACTS_MAP } from "./config/arbitrumOne";

export function getOrCreateAccount(address: string) : Account {
  let account = Account.load(address);
  if (!account) {
    account = new Account(address);
    account.totalDepositedUSD = BigInt.zero();
    account.totalDebtUSD = BigInt.zero();
    // account.lastUpdatedTimestamp = timestamp;
    account.save();
    // addUniqueUser();
  }
  return account;
}
export function copyAccountSnapshotFromAccount(account: Account, timestamp : BigInt) : AccountSnapshot {
  let accountSnapshot = AccountSnapshot.load(`${account.id}-${timestamp}`);
  if (!accountSnapshot) {
    accountSnapshot = new AccountSnapshot(`${account.id}-${timestamp}`);
  }
  accountSnapshot.totalDepositedUSD = account.totalDepositedUSD;
  accountSnapshot.totalDebtUSD = account.totalDepositedUSD;
  accountSnapshot.timestamp = timestamp;
  accountSnapshot.period = account.lastUpdatedTimestamp ? timestamp.minus(account.lastUpdatedTimestamp) : BigInt.fromI32(0);
  accountSnapshot.save();
  return accountSnapshot;
}

export function getAccountBalanceId(
  account: Account,
  syntheticType: string
): string {
  return `${account.id}-${syntheticType}`;
}
export function getOrCreateAccountBalance(
  account: Account,
  syntheticType: string
): AccountBalance {
  const id = getAccountBalanceId(account, syntheticType);
  let accountBalance = AccountBalance.load(id);

  if (!accountBalance) {
    accountBalance = new AccountBalance(id);
    accountBalance.account = account.id;
    accountBalance.syntheticType = syntheticType;
    accountBalance.debt = BigInt.zero();
    accountBalance.debtUSD = BigInt.zero();
    accountBalance.totalDepositedUSD = BigInt.zero();
    // accountBalance.lastUpdatedTimestamp = timestamp;
    accountBalance.save();    
  }
  return accountBalance;
}

export function copyAccountBalanceSnapshotFromAccountBalance(accountBalance: AccountBalance, timestamp : BigInt) : AccountBalanceSnapshot {
  let accountBalanceSnapshot = AccountBalanceSnapshot.load(`${accountBalance.id}-${timestamp}`);
  if (!accountBalanceSnapshot) {
    accountBalanceSnapshot = new AccountBalanceSnapshot(`${accountBalance.id}-${timestamp}`);
  }
  accountBalanceSnapshot.account = accountBalance.account;
  accountBalanceSnapshot.syntheticType = accountBalance.syntheticType;
  accountBalanceSnapshot.debt = accountBalance.debt;
  accountBalanceSnapshot.debtUSD = accountBalance.debtUSD;
  accountBalanceSnapshot.totalDepositedUSD = accountBalance.totalDepositedUSD;

  accountBalanceSnapshot.timestamp = timestamp;
  accountBalanceSnapshot.period = accountBalance.lastUpdatedTimestamp ? timestamp.minus(accountBalance.lastUpdatedTimestamp) : BigInt.fromI32(0);
  accountBalanceSnapshot.save();
  return accountBalanceSnapshot;
}
export function getOrCreateStrategy(
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
    // strategyBalance.lastUpdatedTimestamp = timestamp;
    strategyBalance.save();
  }
  return strategyBalance;
}

export function copyStrategyBalanceSnapshotFromStrategyBalance(strategyBalance: StrategyBalance, timestamp : BigInt) : StrategyBalanceSnapshot {
  let strategyBalanceSnapshot = StrategyBalanceSnapshot.load(`${strategyBalance.id}-${timestamp}`);
  if (!strategyBalanceSnapshot) {
    strategyBalanceSnapshot = new StrategyBalanceSnapshot(`${strategyBalance.id}-${timestamp}`);
  }
  strategyBalanceSnapshot.accountBalance = strategyBalance.accountBalance;
  strategyBalanceSnapshot.strategy = strategyBalance.strategy;
  strategyBalanceSnapshot.amountDeposited = strategyBalance.amountDeposited;
  strategyBalanceSnapshot.amountDepositedUSD = strategyBalance.amountDepositedUSD;

  strategyBalanceSnapshot.timestamp = timestamp;
  strategyBalanceSnapshot.period = strategyBalance.lastUpdatedTimestamp ? timestamp.minus(strategyBalance.lastUpdatedTimestamp) : BigInt.fromI32(0);
  strategyBalanceSnapshot.save();
  return strategyBalanceSnapshot;
}
export function syncUserPosition(accountAddress: Address, event: ethereum.Event): Account {
  // getSavvyDeFiOrCreate();
  const account = getOrCreateAccount(accountAddress.toHexString());
  const savvyFrontendInfoAggregator = SavvyFrontendInfoAggregatorContract.bind(
    Address.fromString("0x97DCA4000B2b89AFD926f5987ad7b054B3e39dB2")
  );

  if (!savvyFrontendInfoAggregator) {
    account.lastUpdatedTimestamp = event.block.timestamp;
    account.save();
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
    account.lastUpdatedTimestamp = event.block.timestamp;
    account.save();
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
    const savvyPositionManagerAddress = pool.savvyPositionManager.toHexString().toLowerCase();
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
      accountBalance = getOrCreateAccountBalance(account, syntheticType);
      accountBalance.totalDepositedUSD = BigInt.zero();
      syntheticTypeToAccountBalanceMap.set(syntheticType, accountBalance);
    } else {
      accountBalance = syntheticTypeToAccountBalanceMap.get(syntheticType)!;
    }

    log.debug("Daiki-13 = {}", [
      accountAddress.toHexString(),
    ]);
    const strategy = getOrCreateStrategy(
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
    
    copyStrategyBalanceSnapshotFromStrategyBalance(strategyBalance, event.block.timestamp);
    strategyBalance.lastUpdatedTimestamp = event.block.timestamp;
    strategyBalance.save();

    copyAccountBalanceSnapshotFromAccountBalance(accountBalance, event.block.timestamp);
    accountBalance.lastUpdatedTimestamp = event.block.timestamp;
    accountBalance.save();
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
    
    copyAccountBalanceSnapshotFromAccountBalance(accountBalance, event.block.timestamp);
    accountBalance.lastUpdatedTimestamp = event.block.timestamp;
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

  copyAccountSnapshotFromAccount(account, event.block.timestamp);
  account.lastUpdatedTimestamp = event.block.timestamp;
  account.save();
  return account;
}
