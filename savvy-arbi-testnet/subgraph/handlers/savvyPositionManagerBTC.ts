import { 
  DepositYieldToken as DepositYieldTokenEvent,
  WithdrawYieldToken as WithdrawYieldTokenEvent,
  Borrow as BorrowEvent,
  RepayWithDebtToken as RepayWithDebtTokenEvent,
  RepayWithBaseToken as RepayWithBaseTokenEvent,
  RepayWithCollateral as RepayWithCollateralEvent
} from '../../generated/SavvyPositionManagerUSD/SavvyPositionManager'

import * as SavvyPositionManagerReducer from '../reducers/savvyPositionManager';

export function handleDepositYieldToken(depositYieldToken: DepositYieldTokenEvent): void {
  SavvyPositionManagerReducer.handleDepositYieldToken(depositYieldToken);
}

export function handleWithdrawYieldToken(withdrawYieldToken: WithdrawYieldTokenEvent): void {
  SavvyPositionManagerReducer.handleWithdrawYieldToken(withdrawYieldToken);
}

export function handleBorrow(borrow: BorrowEvent): void {
  SavvyPositionManagerReducer.handleBorrow(borrow);
}

export function handleRepayWithDebtToken(repayWithDebtToken: RepayWithDebtTokenEvent): void {
  SavvyPositionManagerReducer.handleRepayWithDebtToken(repayWithDebtToken);
}

export function handleRepayWithBaseToken(repayWithBaseToken: RepayWithBaseTokenEvent): void {
  SavvyPositionManagerReducer.handleRepayWithBaseToken(repayWithBaseToken);
}

export function handleRepayWithCollateral(repayWithCollateral: RepayWithCollateralEvent): void {
  SavvyPositionManagerReducer.handleRepayWithCollateral(repayWithCollateral);
}