import {
  Borrow,
  DepositYieldToken,
  RepayWithBaseToken,
  RepayWithCollateral,
  RepayWithDebtToken,
  WithdrawYieldToken,
} from "../../generated/SavvyPositionManager/SavvyPositionManager";

import {
  SPMBorrowEvent,
  SPMDepositYieldTokenEvent,
  SPMRepayWithBaseTokenEvent,
  SPMRepayWithCollateralEvent,
  SPMRepayWithDebtTokenEvent,
  SPMWithdrawYieldTokenEvent,
} from "../../generated/schema";
import { createEvent } from "./utils";

export function createDepositYieldTokenEvent(
  event: DepositYieldToken
): SPMDepositYieldTokenEvent {
  const depositYieldTokenEvent = createEvent<SPMDepositYieldTokenEvent>(event);
  depositYieldTokenEvent.sender = event.params.sender.toHexString();
  depositYieldTokenEvent.yieldToken = event.params.yieldToken;
  depositYieldTokenEvent.amount = event.params.amount;
  depositYieldTokenEvent.recipient = event.params.recipient.toHexString();
  depositYieldTokenEvent.save();
  return depositYieldTokenEvent;
}

export function createWithdrawYieldTokenEvent(
  event: WithdrawYieldToken
): SPMWithdrawYieldTokenEvent {
  const withdrawYieldTokenEvent =
    createEvent<SPMWithdrawYieldTokenEvent>(event);
  withdrawYieldTokenEvent.owner = event.params.owner.toHexString();
  withdrawYieldTokenEvent.yieldToken = event.params.yieldToken;
  withdrawYieldTokenEvent.shares = event.params.shares;
  withdrawYieldTokenEvent.recipient = event.params.recipient.toHexString();
  withdrawYieldTokenEvent.save();
  return withdrawYieldTokenEvent;
}

export function createBorrowEvent(event: Borrow): SPMBorrowEvent {
  const borrowEvent = createEvent<SPMBorrowEvent>(event);
  borrowEvent.owner = event.params.owner.toHexString();
  borrowEvent.amount = event.params.amount;
  borrowEvent.recipient = event.params.recipient.toHexString();
  borrowEvent.save();
  return borrowEvent;
}

export function createRepayWithDebtTokenEvent(
  event: RepayWithDebtToken
): SPMRepayWithDebtTokenEvent {
  const repayWithDebtTokenEvent =
    createEvent<SPMRepayWithDebtTokenEvent>(event);
  repayWithDebtTokenEvent.sender = event.params.sender.toHexString();
  repayWithDebtTokenEvent.amount = event.params.amount;
  repayWithDebtTokenEvent.recipient = event.params.recipient.toHexString();
  repayWithDebtTokenEvent.save();
  return repayWithDebtTokenEvent;
}

export function createRepayWithBaseTokenEvent(
  event: RepayWithBaseToken
): SPMRepayWithBaseTokenEvent {
  const repayWithBaseTokenEvent =
    createEvent<SPMRepayWithBaseTokenEvent>(event);
  repayWithBaseTokenEvent.sender = event.params.sender.toHexString();
  repayWithBaseTokenEvent.baseToken = event.params.baseToken;
  repayWithBaseTokenEvent.amount = event.params.amount;
  repayWithBaseTokenEvent.recipient = event.params.recipient.toHexString();
  repayWithBaseTokenEvent.credit = event.params.credit;
  repayWithBaseTokenEvent.save();
  return repayWithBaseTokenEvent;
}

export function createRepayWithCollateralEvent(
  event: RepayWithCollateral
): SPMRepayWithCollateralEvent {
  const repayWithCollateralEvent =
    createEvent<SPMRepayWithCollateralEvent>(event);
  repayWithCollateralEvent.owner = event.params.owner.toHexString();
  repayWithCollateralEvent.yieldToken = event.params.yieldToken;
  repayWithCollateralEvent.baseToken = event.params.baseToken;
  repayWithCollateralEvent.shares = event.params.shares;
  repayWithCollateralEvent.credit = event.params.credit;
  repayWithCollateralEvent.save();
  return repayWithCollateralEvent;
}
