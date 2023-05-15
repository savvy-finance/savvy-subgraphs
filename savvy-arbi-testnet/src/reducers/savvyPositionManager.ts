import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { 
    DepositYieldToken,
    WithdrawYieldToken,
    Borrow,
    RepayWithDebtToken,
    RepayWithBaseToken,
    RepayWithCollateral
 } from '../../generated/SavvyPositionManagerUSD/SavvyPositionManager'
import { BorrowEvent, DepositYieldTokenEvent, RepayWithBaseTokenEvent, RepayWithCollateralEvent, RepayWithDebtTokenEvent, WithdrawYieldTokenEvent } from '../../generated/schema';
import { createEvent } from '../utils/entities/blockchainPrimitives';
import * as SavvyFrontendInfoAggregatorReducer from "./savvyFrontendInfoAggregator";

export function handleDepositYieldToken(depositYieldToken: DepositYieldToken): void {
    const sender = SavvyFrontendInfoAggregatorReducer.syncUserPosition(depositYieldToken.params.sender);
    const recipient = SavvyFrontendInfoAggregatorReducer.syncUserPosition(depositYieldToken.params.recipient);
    const event = createEvent<DepositYieldTokenEvent>(depositYieldToken as ethereum.Event);
    event.sender = sender.id;
    event.yieldToken = Bytes.fromHexString(depositYieldToken.params.yieldToken.toHexString());
    event.amount = depositYieldToken.params.amount;
    event.recipient = recipient.id;
    event.save()
}
export function handleWithdrawYieldToken(withdrawYieldToken: WithdrawYieldToken): void { 
    const owner = SavvyFrontendInfoAggregatorReducer.syncUserPosition(withdrawYieldToken.params.owner);
    const recipient = SavvyFrontendInfoAggregatorReducer.syncUserPosition(withdrawYieldToken.params.recipient);
    const event = createEvent<WithdrawYieldTokenEvent>(withdrawYieldToken as ethereum.Event);
    event.owner = owner.id;
    event.yieldToken = Bytes.fromHexString(withdrawYieldToken.params.yieldToken.toHexString());
    event.shares = withdrawYieldToken.params.shares;
    event.recipient = recipient.id;
    event.save();
}
export function handleBorrow(borrow: Borrow): void { 
    const owner = SavvyFrontendInfoAggregatorReducer.syncUserPosition(borrow.params.owner);
    const recipient = SavvyFrontendInfoAggregatorReducer.syncUserPosition(borrow.params.recipient);
    const event = createEvent<BorrowEvent>(borrow as ethereum.Event);
    event.owner = owner.id;
    event.amount = borrow.params.amount;
    event.recipient = recipient.id;
    event.save();
}
export function handleRepayWithDebtToken(repayWithDebtToken: RepayWithDebtToken): void { 
    const sender = SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithDebtToken.params.sender);
    const recipient = SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithDebtToken.params.recipient);
    const event = createEvent<RepayWithDebtTokenEvent>(repayWithDebtToken as ethereum.Event);
    event.sender = sender.id;
    event.amount = repayWithDebtToken.params.amount;
    event.recipient = recipient.id;
    event.save();
}
export function handleRepayWithBaseToken(repayWithBaseToken: RepayWithBaseToken): void { 
    const sender = SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithBaseToken.params.sender);
    const recipient = SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithBaseToken.params.recipient);
    const event = createEvent<RepayWithBaseTokenEvent>(repayWithBaseToken as ethereum.Event);
    event.sender = sender.id;
    event.baseToken = Bytes.fromHexString(repayWithBaseToken.params.baseToken.toHexString());
    event.amount = repayWithBaseToken.params.amount;
    event.recipient = recipient.id;
    event.credit = repayWithBaseToken.params.credit;
    event.save();
}
export function handleRepayWithCollateral(repayWithCollateral: RepayWithCollateral): void { 
    const owner = SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithCollateral.params.owner);
    const event = createEvent<RepayWithCollateralEvent>(repayWithCollateral as ethereum.Event);
    event.owner = owner.id;
    event.yieldToken = Bytes.fromHexString(repayWithCollateral.params.yieldToken.toHexString());
    event.baseToken = Bytes.fromHexString(repayWithCollateral.params.baseToken.toHexString());
    event.shares = repayWithCollateral.params.shares;
    event.credit = repayWithCollateral.params.credit;
    event.save();
}
    