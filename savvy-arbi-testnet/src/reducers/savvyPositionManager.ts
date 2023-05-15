import { 
    DepositYieldToken as DepositYieldTokenEvent,
    WithdrawYieldToken as WithdrawYieldTokenEvent,
    Borrow as BorrowEvent,
    RepayWithDebtToken as RepayWithDebtTokenEvent,
    RepayWithBaseToken as RepayWithBaseTokenEvent,
    RepayWithCollateral as RepayWithCollateralEvent
 } from '../../generated/SavvyPositionManagerUSD/SavvyPositionManager'
import * as SavvyFrontendInfoAggregatorReducer from "./savvyFrontendInfoAggregator";

export function handleDepositYieldToken(depositYieldToken: DepositYieldTokenEvent): void {
    SavvyFrontendInfoAggregatorReducer.syncUserPosition(depositYieldToken.params.recipient);
}
export function handleWithdrawYieldToken(withdrawYieldToken: WithdrawYieldTokenEvent): void { 
    SavvyFrontendInfoAggregatorReducer.syncUserPosition(withdrawYieldToken.params.recipient);
}
export function handleBorrow(borrow: BorrowEvent): void { 
    SavvyFrontendInfoAggregatorReducer.syncUserPosition(borrow.params.recipient);
}
export function handleRepayWithDebtToken(repayWithDebtToken: RepayWithDebtTokenEvent): void { 
    SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithDebtToken.params.recipient);
}
export function handleRepayWithBaseToken(repayWithBaseToken: RepayWithBaseTokenEvent): void { 
    SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithBaseToken.params.recipient);
}
export function handleRepayWithCollateral(repayWithCollateral: RepayWithCollateralEvent): void { 
    SavvyFrontendInfoAggregatorReducer.syncUserPosition(repayWithCollateral.params.owner);
}
    