import {
  Borrow as BorrowEvent,
  DepositYieldToken as DepositYieldTokenEvent,
  RepayWithBaseToken as RepayWithBaseTokenEvent,
  RepayWithCollateral as RepayWithCollateralEvent,
  RepayWithDebtToken as RepayWithDebtTokenEvent,
  WithdrawYieldToken as WithdrawYieldTokenEvent,
} from "../../generated/SavvyPositionManagerBTC/SavvyPositionManager";

import {
  SPMDeposit as DepositEntity,
  SPMBorrow as BorrowEntity,
  SPMRepay as RepayEntity,
  SPMWithdraw as WithdrawEntity
} from "../../generated/schema";
import { createEvent } from "./utils";

export function createDepositYieldTokenEvent(
  event: DepositYieldTokenEvent
): DepositEntity {
  const depositEntity = createEvent<DepositEntity>(event);
  depositEntity.sender = event.params.sender;
  depositEntity.yieldToken = event.params.yieldToken;
  depositEntity.amount = event.params.amount;
  depositEntity.recipient = event.params.recipient;
  depositEntity.save();
  return depositEntity;
}

export function createWithdrawYieldTokenEvent(
  event: WithdrawYieldTokenEvent
): WithdrawEntity {
  const withdrawEntity =
    createEvent<WithdrawEntity>(event);
  withdrawEntity.owner = event.params.owner;
  withdrawEntity.yieldToken = event.params.yieldToken;
  withdrawEntity.shares = event.params.shares;
  withdrawEntity.recipient = event.params.recipient;
  withdrawEntity.save();
  return withdrawEntity;
}

export function createBorrowEvent(event: BorrowEvent): BorrowEntity {
  const borrowEntity = createEvent<BorrowEntity>(event);
  borrowEntity.owner = event.params.owner;
  borrowEntity.amount = event.params.amount;
  borrowEntity.recipient = event.params.recipient;
  borrowEntity.save();
  return borrowEntity;
}

export function createRepayWithDebtTokenEvent(
  event: RepayWithDebtTokenEvent
): RepayEntity {
  const repayEntity =
    createEvent<RepayEntity>(event);

  repayEntity.repayer = event.params.sender;
  repayEntity.repayWith = "DebtToken";
  repayEntity.repayToken = event.params.recipient;  // It must be debt token of SPM
  repayEntity.repayTokenAmount = event.params.amount;
  repayEntity.credit = event.params.amount;
  repayEntity.recipient = event.params.recipient;
  repayEntity.save();
  return repayEntity;
}

export function createRepayWithBaseTokenEvent(
  event: RepayWithBaseTokenEvent
): RepayEntity {
  const repayEntity =
    createEvent<RepayEntity>(event);

  repayEntity.repayer = event.params.sender;
  repayEntity.repayWith = "BaseToken";
  repayEntity.repayToken = event.params.baseToken;
  repayEntity.repayTokenAmount = event.params.amount;
  repayEntity.credit = event.params.credit;
  repayEntity.recipient = event.params.recipient;
  repayEntity.save();
  return repayEntity;
}

export function createRepayWithCollateralEvent(
  event: RepayWithCollateralEvent
): RepayEntity {
  const repayEntity =
    createEvent<RepayEntity>(event);

  repayEntity.repayer = event.params.owner;
  repayEntity.repayWith = "Collateral";
  repayEntity.repayToken = event.params.yieldToken;
  repayEntity.repayTokenAmount = event.params.shares;  // It must be calculated in amount from shares 
  repayEntity.credit = event.params.credit;
  repayEntity.recipient = event.params.owner;
  repayEntity.save();
  return repayEntity;
}
