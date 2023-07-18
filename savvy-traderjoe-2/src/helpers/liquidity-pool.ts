import { ethereum, Address } from '@graphprotocol/graph-ts';
import { LiquidityPool } from '../../generated/schema';
import { LBPair } from '../../generated/TJ_LP_SVUSD/LBPair';
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from '../constants';
import { normalizeToEighteenDecimals } from '../utils/tokens';
import { getLPPairInUSD } from '../utils/trader-joe';
import { getOrCreateToken } from './token';
import { createLiquidityPoolSnapshot } from './liquidity-pool-snapshot';
import { updateProtocolPoolLiquidity } from './protocol';

export function getOrCreateLiquidityPool(contractAddress: Address): LiquidityPool {
  const id = contractAddress.toHexString();
  let liquidityPool = LiquidityPool.load(id);
  if (!liquidityPool) {
    const lbPair = LBPair.bind(contractAddress);
    liquidityPool = new LiquidityPool(id);
    liquidityPool.savvySynthetic = getOrCreateToken(lbPair.getTokenX()).id;
    const pairToken = getOrCreateToken(lbPair.getTokenY());
    liquidityPool.pairToken = pairToken.id;
    const reserves = lbPair.getReserves();
    liquidityPool.savvySyntheticBalance = reserves.getReserveX();
    liquidityPool.pairTokenBalance = reserves.getReserveY();
    liquidityPool.pairTokenBalanceNormalized = normalizeToEighteenDecimals(reserves.getReserveY(), pairToken.decimals);
    liquidityPool.totalValueUSD = BIGDECIMAL_ZERO;
    liquidityPool.lastUpdatedBN = BIGINT_ZERO;
    liquidityPool.lastUpdatedTimestamp = BIGINT_ZERO;
    liquidityPool.save();
  }
  return liquidityPool;
}

export function updateLiquidityPool(contractAddress: Address, block: ethereum.Block): LiquidityPool {
  const liquidityPool = getOrCreateLiquidityPool(contractAddress);
  const lbPair = LBPair.bind(contractAddress);
  const reserves = lbPair.getReserves();
  liquidityPool.savvySyntheticBalance = reserves.getReserveX();
  liquidityPool.pairTokenBalance = reserves.getReserveY();
  const pairtokenAddress = lbPair.getTokenY();
  const pairToken = getOrCreateToken(pairtokenAddress);
  liquidityPool.pairTokenBalanceNormalized = normalizeToEighteenDecimals(reserves.getReserveY(), pairToken.decimals);
  liquidityPool.totalValueUSD = getLPPairInUSD(
    lbPair.getActiveId(),
    liquidityPool.savvySyntheticBalance,
    pairtokenAddress,
    liquidityPool.pairTokenBalance,
    pairToken.decimals
  );
  liquidityPool.lastUpdatedBN = block.number;
  liquidityPool.lastUpdatedTimestamp = block.timestamp;
  liquidityPool.save();
  createLiquidityPoolSnapshot(contractAddress, block, liquidityPool);
  updateProtocolPoolLiquidity(liquidityPool, block);
  return liquidityPool;
}
