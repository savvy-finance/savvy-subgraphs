import {
  DepositYieldToken as DepositYieldTokenEvent,
  Borrow as BorrowEvent,
  RepayWithDebtToken as RepayWithDebtTokenEvent,
  RepayWithBaseToken as RepayWithBaseTokenEvent,
  RepayWithCollateral as RepayWithCollateralEvent,
  WithdrawYieldToken as WithdrawYieldTokenEvent,
} from "../generated/SavvyPositionManager/SavvyPositionManager"
import { Deposit, Borrow, Repay, Withdraw } from "../generated/schema"
import {
  createBorrowEvent,
  createDepositYieldTokenEvent,
  createRepayWithBaseTokenEvent,
  createRepayWithCollateralEvent,
  createRepayWithDebtTokenEvent,
  createWithdrawYieldTokenEvent,
} from "./helpers/savvyPositionManager";

export function handleDepositYieldToken(event: DepositYieldTokenEvent): void {
  createDepositYieldTokenEvent(event);
}

export function handleWithdrawYieldToken(event: WithdrawYieldTokenEvent): void {
  createWithdrawYieldTokenEvent(event);
}

export function handleBorrow(event: BorrowEvent): void {
  createBorrowEvent(event);
}

export function handleRepayWithDebtToken(event: RepayWithDebtTokenEvent): void {
  createRepayWithDebtTokenEvent(event);
}

export function handleRepayWithBaseToken(event: RepayWithBaseTokenEvent): void {
  createRepayWithBaseTokenEvent(event);
}

export function handleRepayWithCollateral(event: RepayWithCollateralEvent): void {
  createRepayWithCollateralEvent(event);
}

