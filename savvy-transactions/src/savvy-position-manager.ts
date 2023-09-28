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
