import {
  DepositYieldToken as DepositYieldTokenEvent,
  Borrow as BorrowEvent,
  RepayWithDebtToken as RepayWithDebtTokenEvent,
  RepayWithBaseToken as RepayWithBaseTokenEvent,
  RepayWithCollateral as RepayWithCollateralEvent,
  WithdrawYieldToken as WithdrawYieldTokenEvent,
} from "../../generated/SavvyPositionManagerBTC/SavvyPositionManager"
import { syncUserPosition } from "../helpers/account";
import {
  createBorrowEvent,
  createDepositYieldTokenEvent,
  createRepayWithBaseTokenEvent,
  createRepayWithCollateralEvent,
  createRepayWithDebtTokenEvent,
  createWithdrawYieldTokenEvent,
} from "../helpers/savvyPositionManager";

export function handleDepositYieldToken(event: DepositYieldTokenEvent): void {
  syncUserPosition(event.params.sender, event);
  syncUserPosition(event.params.recipient, event);
  createDepositYieldTokenEvent(event);
}

export function handleWithdrawYieldToken(event: WithdrawYieldTokenEvent): void {
  syncUserPosition(event.params.owner, event);
  syncUserPosition(event.params.recipient, event);
  createWithdrawYieldTokenEvent(event);
}

export function handleBorrow(event: BorrowEvent): void {
  syncUserPosition(event.params.owner, event);
  syncUserPosition(event.params.recipient, event);
  createBorrowEvent(event);
}

export function handleRepayWithDebtToken(event: RepayWithDebtTokenEvent): void {
  syncUserPosition(event.params.sender, event);
  syncUserPosition(event.params.recipient, event);
  createRepayWithDebtTokenEvent(event);
}

export function handleRepayWithBaseToken(event: RepayWithBaseTokenEvent): void {
  syncUserPosition(event.params.sender, event);
  syncUserPosition(event.params.recipient, event);
  createRepayWithBaseTokenEvent(event);
}

export function handleRepayWithCollateral(event: RepayWithCollateralEvent): void {
  syncUserPosition(event.params.owner, event);
  createRepayWithCollateralEvent(event);
}

