import { Address, log, BigInt } from "@graphprotocol/graph-ts";
import { dataSource } from '@graphprotocol/graph-ts'

import {
  Borrow as BorrowEvent,
  DepositYieldToken as DepositYieldTokenEvent,
  RepayWithBaseToken as RepayWithBaseTokenEvent,
  RepayWithCollateral as RepayWithCollateralEvent,
  RepayWithDebtToken as RepayWithDebtTokenEvent,
  WithdrawYieldToken as WithdrawYieldTokenEvent,
  SavvyPositionManager as SavvyPositionManagerContract,
} from "../../generated/SavvyPositionManagerBTC/SavvyPositionManager";
import { YieldStrategyManager as YieldStrategyManagerContract } from "../../generated/SavvyPositionManagerBTC/YieldStrategyManager";

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

  const SPMContract = SavvyPositionManagerContract.bind(
    dataSource.address()
  );
  const debtTokenResult = SPMContract.try_debtToken();
  if (debtTokenResult.reverted) {
    log.warning("Failed to load debt token for repayToken", [
      dataSource.address().toHexString(),
    ]);
    repayEntity.repayToken = Address.zero();
  }
  else {
    repayEntity.repayToken = debtTokenResult.value;
  }
  // repayEntity.repayToken = event.params.recipient;  // Wront data - It must be debt token of SPM (Need integrate with contract)

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

  const SPMContract = SavvyPositionManagerContract.bind(
    dataSource.address()
  );
  const YSMAddressResult = SPMContract.try__yieldStrategyManager();
  if (YSMAddressResult.reverted) {
    log.warning("Failed to load yieldStrategyManager", [
      dataSource.address().toHexString(),
    ]);
    repayEntity.repayTokenAmount = BigInt.fromU32(0);
  }
  else {
    const YSMContract = YieldStrategyManagerContract.bind(YSMAddressResult.value);
    const yieldTokenAmountResult = YSMContract.try_convertSharesToYieldTokens(event.params.yieldToken, event.params.shares);

    if (yieldTokenAmountResult.reverted) {
      log.warning("Failed to call convertSharesToYieldTokens", [
        YSMAddressResult.value.toHexString(),
      ]);
      repayEntity.repayTokenAmount = BigInt.fromU32(0);
    }
    else {
      repayEntity.repayTokenAmount = yieldTokenAmountResult.value;
    }
  }
  // repayEntity.repayTokenAmount = event.params.shares;  // Wrong Data - It must be calculated in amount from shares (Need integrate with contract)

  repayEntity.credit = event.params.credit;
  repayEntity.recipient = event.params.owner;
  repayEntity.save();
  return repayEntity;
}
