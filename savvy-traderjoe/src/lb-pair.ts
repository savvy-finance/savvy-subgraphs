import { BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { BIGINT_ONE, BIGINT_TEN, QUARTERHOUR_IN_SECONDS, TJ_LP_SVBTC, TJ_LP_SVETH, TJ_LP_SVUSD } from "./constants";
import { createPairHourlySnapshot, createPairSnapshot, getOrCreatePair, getPriceFromBinId, updatePair } from "./helpers/pair";
import { DepositedToBins, WithdrawnFromBins } from '../generated/TJ_LP_SVUSD/LBPair';
import { getAmounts } from "./helpers/trader-joe";
import { LBPair } from "../generated/TJ_LP_SVBTC/LBPair";
import { createAccountLiquiditySnapshot, updateAccountLiquidity } from "./helpers/account";
import { getOrCreateToken } from "./helpers/token";

function handlePair(block: ethereum.Block, contractAddress: string): void {
  updatePair(block, contractAddress);
}

export function handleSvUSDPair(block: ethereum.Block): void {
  handlePair(block, TJ_LP_SVUSD);
}
export function handleSvETHPair(block: ethereum.Block): void {
  handlePair(block, TJ_LP_SVETH);
}
export function handleSvBTCPair(block: ethereum.Block): void {
  handlePair(block, TJ_LP_SVBTC);
}

export function handleAddLiquidity(event: DepositedToBins): void {
  createPairHourlySnapshot(event.block, event.address.toHexString());
  createPairSnapshot(event.block, event.address.toHexString(), QUARTERHOUR_IN_SECONDS);
  const lbPair = LBPair.bind(event.address);
  const amounts = getAmounts(event.params.amounts);
  const token = getOrCreateToken(lbPair.getTokenY().toHexString());
  const liquidityUSD = getPriceFromBinId(
      lbPair.getActiveId(), 
      amounts[0], 
      token.id,
      amounts[1],
      token.decimals
  );

  updateAccountLiquidity(
    event.block,
    event.params.to.toHexString(), 
    lbPair._address.toHexString(),
    amounts[0],
    amounts[1].times(BIGINT_TEN.pow(<u8>(18 - token.decimals))),
    liquidityUSD
  );
  createAccountLiquiditySnapshot(event.block, event.params.to.toHexString(), lbPair._address.toHexString(), QUARTERHOUR_IN_SECONDS);
}
export function handleRemoveLiquidity(event: WithdrawnFromBins): void {
  createPairHourlySnapshot(event.block, event.address.toHexString());
  createPairSnapshot(event.block, event.address.toHexString(), QUARTERHOUR_IN_SECONDS);
  const lbPair = LBPair.bind(event.address);
  const amounts = getAmounts(event.params.amounts);
  const token = getOrCreateToken(lbPair.getTokenY().toHexString());
  const liquidityUSD = getPriceFromBinId(
      lbPair.getActiveId(), 
      amounts[0], 
      lbPair.getTokenY().toHexString(),
      amounts[1],
      token.decimals
  );

  updateAccountLiquidity(
    event.block,
    event.params.to.toHexString(), 
    lbPair._address.toHexString(),
    amounts[0],
    amounts[1].times(BIGINT_TEN.pow(<u8>(18 - token.decimals))),
    liquidityUSD.neg()
  );
  createAccountLiquiditySnapshot(event.block, event.params.to.toHexString(), lbPair._address.toHexString(), QUARTERHOUR_IN_SECONDS);
}