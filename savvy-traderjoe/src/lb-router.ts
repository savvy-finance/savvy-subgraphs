import { AddLiquidityCall, RemoveLiquidityCall } from '../generated/TJ_LPRouter/LBRouter';
import { getLBPairFromSynthetic, getPriceFromBinId } from './helpers/pair';
import { getOrCreateToken, isSavvySynthetic } from './helpers/token';
import { createAccountLiquiditySnapshot, updateAccount } from './helpers/account';
import { QUARTERHOUR_IN_SECONDS } from './constants';

export function handleAddLiquidity(call: AddLiquidityCall): void {
    if (!isSavvySynthetic(call.inputs.liquidityParameters.tokenX.toHexString())) {
        return;
    }
    const lbPair = getLBPairFromSynthetic(call.inputs.liquidityParameters.tokenX.toHexString());
    if (!lbPair) {
        return;
    }
    
    const liquidityUSD = getPriceFromBinId(
        lbPair.getActiveId(), 
        call.outputs.amountXAdded, 
        call.inputs.liquidityParameters.tokenY.toHexString(),
        call.outputs.amountYAdded,
        getOrCreateToken(call.inputs.liquidityParameters.tokenY.toHexString()).decimals
    );

    updateAccount(call.block, call.from.toHexString(), liquidityUSD);
    createAccountLiquiditySnapshot(call.block, call.from.toHexString(), QUARTERHOUR_IN_SECONDS);
}

export function handleRemoveLiquidity(call: RemoveLiquidityCall): void {
    if (!isSavvySynthetic(call.inputs.tokenX.toHexString())) {
        return;
    }
    const lbPair = getLBPairFromSynthetic(call.inputs.tokenX.toHexString());
    if (!lbPair) {
        return;
    }
    
    const liquidityUSD = getPriceFromBinId(
        lbPair.getActiveId(), 
        call.outputs.amountX, 
        call.inputs.tokenY.toHexString(),
        call.outputs.amountY,
        getOrCreateToken(call.inputs.tokenY.toHexString()).decimals
    );

    updateAccount(call.block, call.from.toHexString(), liquidityUSD.neg());
    createAccountLiquiditySnapshot(call.block, call.from.toHexString(), QUARTERHOUR_IN_SECONDS);
}