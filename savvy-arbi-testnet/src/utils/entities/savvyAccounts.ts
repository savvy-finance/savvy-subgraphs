import { Address, BigInt, Bytes, Entity } from '@graphprotocol/graph-ts';
import { Account, AccountBalance, Strategy, StrategyBalance } from '../../../generated/schema';

// export interface ActionState {
//     account: Account;
//     accountBalance: AccountBalance;
//     strategy: Strategy;
//     strategyBalance: StrategyBalance;
// }
// export function execute(accountAddress: string, syntheticType: string, strategyAddress: string, action: (state: ActionState) => void): void {
//     const account = getOrCreateAccount(accountAddress);
//     const accountBalance = getOrCreateAccountBalance(account, syntheticType);
//     const strategy = getOrCreateStrategy(strategyAddress);
//     const strategyBalance = getOrCreateStrategyBalance(accountBalance, strategy);

//     action({
//         account, 
//         accountBalance,
//         strategy, 
//         strategyBalance
//     });

//     account.save();
//     accountBalance.save();
//     strategy.save();
//     strategyBalance.save();
// }

export function getOrCreateAccount(address: string): Account {
    let account = Account.load(address);
    if (!account) {
        account = new Account(address);
        account.totalDepositedUSD = BigInt.zero();
        account.totalDebtUSD = BigInt.zero();
        account.save();
    }
    return account;
}

export function getAccountBalanceId(account: Account, syntheticType: string): string {
    return `${account.id}/${syntheticType}`;
}
export function getOrCreateAccountBalance(account: Account, syntheticType: string): AccountBalance {
    const id = getAccountBalanceId(account, syntheticType);
    let accountBalance = AccountBalance.load(id);
    if (!accountBalance) {
        accountBalance = new AccountBalance(id);
        accountBalance.account = account.id;
        accountBalance.syntheticType = syntheticType;
        accountBalance.debt = BigInt.zero();
        accountBalance.debtUSD = BigInt.zero();
        accountBalance.totalDepositedUSD = BigInt.zero();
        accountBalance.save();
    }
    return accountBalance;
}

export function getOrCreateStrategy(strategyAddress: string, baseTokenAddress?: string): Strategy {
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

export function getStrategyBalanceId(accountBalance: AccountBalance, strategy: Strategy): string {
    return `${accountBalance.id}/${strategy.id}`;
}
export function getOrCreateStrategyBalance(accountBalance: AccountBalance, strategy: Strategy): StrategyBalance {
    const id = getStrategyBalanceId(accountBalance, strategy);
    let strategyBalance = StrategyBalance.load(id);
    if (!strategyBalance) {
        strategyBalance = new StrategyBalance(id);
        strategyBalance.accountBalance = accountBalance.id;
        strategyBalance.strategy = strategy.id;
        strategyBalance.amountDeposited = BigInt.zero();
        strategyBalance.amountDepositedUSD = BigInt.zero();
        strategyBalance.save();
    }
    return strategyBalance;
}