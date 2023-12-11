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
    account.lastUpdatedTimestamp = BigInt.zero();
    account.stakedSVY = BigInt.zero();
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
  accountSnapshot.stakedSVY = account.stakedSVY;
  accountSnapshot.timestamp = timestamp;
  accountSnapshot.period = account.lastUpdatedTimestamp.equals(BigInt.zero()) ? timestamp.minus(account.lastUpdatedTimestamp) : BigInt.zero();
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
    accountBalance.lastUpdatedTimestamp = BigInt.zero();
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
  accountBalanceSnapshot.period = accountBalance.lastUpdatedTimestamp.equals(BigInt.zero()) ? timestamp.minus(accountBalance.lastUpdatedTimestamp) :  BigInt.zero();
  accountBalanceSnapshot.save();
  return accountBalanceSnapshot;
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
    strategyBalance.lastUpdatedTimestamp = BigInt.zero();
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
  strategyBalanceSnapshot.period = strategyBalance.lastUpdatedTimestamp.equals(BigInt.zero()) ? timestamp.minus(strategyBalance.lastUpdatedTimestamp) :  BigInt.zero();
  strategyBalanceSnapshot.save();
  return strategyBalanceSnapshot;
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
export function syncUserPosition(accountAddress: Address, event: ethereum.Event): Account {
  // getSavvyDeFiOrCreate();
  const account = getOrCreateAccount(accountAddress.toHexString());
  const savvyFrontendInfoAggregator = SavvyFrontendInfoAggregatorContract.bind(
    Address.fromString("0x97DCA4000B2b89AFD926f5987ad7b054B3e39dB2")
  );

  if (!savvyFrontendInfoAggregator) {
    account.lastUpdatedTimestamp = account.lastUpdatedTimestamp ? account.lastUpdatedTimestamp : BigInt.zero();
    account.save();
    return account;
  }

  const poolsPageInfoResult =
    savvyFrontendInfoAggregator.try_getPoolsPageInfo(accountAddress);
  if (poolsPageInfoResult.reverted) {
    log.warning("Failed to load pools page for account={}", [
      accountAddress.toHexString(),
    ]);
    account.lastUpdatedTimestamp = account.lastUpdatedTimestamp ? account.lastUpdatedTimestamp : BigInt.zero();
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

  for (let i = 0; i < poolsPageInfo.pools.length; i++) {
    const pool = poolsPageInfo.pools[i];
    const savvyPositionManagerAddress = pool.savvyPositionManager.toHexString().toLowerCase();
    const contractDetails = ADDRESS_TO_CONTRACTS_MAP.get(
      savvyPositionManagerAddress
    );

    if (!contractDetails) {
      continue;
    }

    let syntheticType = contractDetails.get("syntheticType");
    if (!syntheticType) {
      continue;
    }
    syntheticType = syntheticType!;

    let accountBalance: AccountBalance;
    if (!syntheticTypeToAccountBalanceMap.isSet(syntheticType)) {
      accountBalance = getOrCreateAccountBalance(account, syntheticType);
      accountBalance.totalDepositedUSD = BigInt.zero();
      syntheticTypeToAccountBalanceMap.set(syntheticType, accountBalance);
    } else {
      accountBalance = syntheticTypeToAccountBalanceMap.get(syntheticType)!;
    }

    const strategy = getOrCreateStrategy(
      pool.poolAddress.toHexString(),
      pool.baseTokenAddress.toHexString()
    );
    const strategyBalance = getOrCreateStrategyBalance(
      accountBalance,
      strategy,
      event.block.timestamp
    );
    strategyBalance.amountDeposited = pool.userDepositedAmount;
    strategyBalance.amountDepositedUSD = pool.userDepositedValueUSD;
    accountBalance.totalDepositedUSD = accountBalance.totalDepositedUSD.plus(
      pool.userDepositedValueUSD
    );
    totalDepositedUSD = totalDepositedUSD.plus(pool.userDepositedValueUSD);

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

  account.totalDebtUSD = totalDebtUSD;
  account.totalDepositedUSD = totalDepositedUSD;

  copyAccountSnapshotFromAccount(account, event.block.timestamp);
  account.lastUpdatedTimestamp = event.block.timestamp;
  account.save();
  return account;
}
