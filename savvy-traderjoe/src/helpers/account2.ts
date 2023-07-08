import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts";
import { Account2, Account2Snapshot } from "../../generated/schema";
import { LBPair } from "../../generated/TJ_LP_SVBTC/LBPair";
import { BIGINT_ZERO, TJ_LP_SVBTC, TJ_LP_SVETH, TJ_LP_SVUSD } from "../constants";
import { checkArrayIsAscSorted, mergeSortedArrays } from "../utils/array";
import { getPriceFromBinId } from "./pair";
import { getOrCreateToken, getPriceUSD, normalize } from "./token";
import { getLiquidityForAccount } from "./trader-joe";

export function getOrCreateAccount(address: string): Account2 {
    let account = Account2.load(address);
    if (!account) {
        account = new Account2(address);
        account.svUSD = BIGINT_ZERO;
        account.USDC = BIGINT_ZERO;
        account.svUSDLiquidityUSD = BIGINT_ZERO;
        account.svUSDBins = [];
        account.svETH = BIGINT_ZERO;
        account.WETH = BIGINT_ZERO;
        account.svETHLiquidityUSD = BIGINT_ZERO;
        account.svETHBins = [];
        account.svBTC = BIGINT_ZERO;
        account.WBTC = BIGINT_ZERO;
        account.svBTCLiquidityUSD = BIGINT_ZERO;
        account.svBTCBins = [];
        account.totalLiquidityUSD = BIGINT_ZERO;
        account.lastUpdatedBN = BIGINT_ZERO;
        account.lastUpdatedTimestamp = BIGINT_ZERO;
        account.save();
    }
    return account;
}

export function getOrCreateAccountSnapshot(address: string, timestamp: BigInt): Account2Snapshot {
    let snapshot = Account2Snapshot.load(`${address}-${timestamp.toString()}`);
    if (!snapshot) {
        snapshot = new Account2Snapshot(address);
        snapshot.svUSD = BIGINT_ZERO;
        snapshot.USDC = BIGINT_ZERO;
        snapshot.svUSDLiquidityUSD = BIGINT_ZERO;
        snapshot.svUSDBins = [];
        snapshot.svETH = BIGINT_ZERO;
        snapshot.WETH = BIGINT_ZERO;
        snapshot.svETHLiquidityUSD = BIGINT_ZERO;
        snapshot.svETHBins = [];
        snapshot.svBTC = BIGINT_ZERO;
        snapshot.WBTC = BIGINT_ZERO;
        snapshot.svBTCLiquidityUSD = BIGINT_ZERO;
        snapshot.svBTCBins = [];
        snapshot.totalLiquidityUSD = BIGINT_ZERO;
        snapshot.blockNumber = BIGINT_ZERO;
        snapshot.timestamp = timestamp;
        snapshot.save();
    }
    return snapshot;
}

export function updateAccountBins(
    accountAdress: string,
    usdBins: BigInt[],
    ethBins: BigInt[],
    btcBins: BigInt[]
): void {
    const account = getOrCreateAccount(accountAdress);
    let sortedBins: BigInt[] = [];
    let mergedBins: BigInt[] = [];
    
    if (usdBins.length > 0) {
        sortedBins = checkArrayIsAscSorted(usdBins);
        mergedBins = mergeSortedArrays(account.svUSDBins, sortedBins);
        account.svUSDBins = mergedBins;
    }

    if (ethBins.length > 0) {
        sortedBins = checkArrayIsAscSorted(ethBins);
        mergedBins = mergeSortedArrays(account.svETHBins, sortedBins);
        account.svETHBins = mergedBins;
    }

    if (btcBins.length > 0) {
        sortedBins = checkArrayIsAscSorted(btcBins);
        mergedBins = mergeSortedArrays(account.svBTCBins, sortedBins);
        account.svBTCBins = mergedBins;
    }

    account.save();
}

export function createSnapshot(block: ethereum.Block, address: string): Account2Snapshot {
    const account = getOrCreateAccount(address);
    const snapshot = getOrCreateAccountSnapshot(address, block.timestamp);

    const usdPool = LBPair.bind(Address.fromString(TJ_LP_SVUSD));
    const usdc = getOrCreateToken(usdPool.getTokenY().toString());
    const usdAmounts = getLiquidityForAccount(address, TJ_LP_SVUSD, account.svUSDBins);
    const normalizedUSDCAmount = normalize(usdAmounts[1], usdc.decimals);
    const usdLiquidity = getPriceUSD(usdc.id, usdAmounts[0].plus(normalizedUSDCAmount));
    account.USDC = normalizedUSDCAmount;
    account.svUSD = usdAmounts[0];
    account.svUSDLiquidityUSD = usdLiquidity;

    const btcPool = LBPair.bind(Address.fromString(TJ_LP_SVBTC));
    const wbtc = getOrCreateToken(btcPool.getTokenY().toString());
    const btcAmounts = getLiquidityForAccount(address, TJ_LP_SVBTC, account.svBTCBins);
    const normalizedWBTCAmount = normalize(btcAmounts[1], wbtc.decimals);
    const btcLiquidity = getPriceUSD(wbtc.id, btcAmounts[0].plus(normalizedWBTCAmount));
    account.WBTC = normalizedWBTCAmount;
    account.svBTC = btcAmounts[0];
    account.svBTCLiquidityUSD = btcLiquidity;

    const ethPool = LBPair.bind(Address.fromString(TJ_LP_SVETH));
    const weth = getOrCreateToken(ethPool.getTokenY().toString());
    const ethAmounts = getLiquidityForAccount(address, TJ_LP_SVETH, account.svETHBins);
    const normalizedWethAmount = normalize(ethAmounts[1], weth.decimals);
    const ethLiquidity = getPriceUSD(weth.id, ethAmounts[0].plus(normalizedWethAmount));
    account.WETH = normalizedWethAmount;
    account.svETH = ethAmounts[0];
    account.svETHLiquidityUSD = ethLiquidity;

    account.totalLiquidityUSD = usdLiquidity.plus(btcLiquidity).plus(ethLiquidity);
    account.lastUpdatedBN = block.number;
    account.lastUpdatedTimestamp = block.timestamp;
    account.save();

    snapshot.USDC = account.USDC;
    snapshot.svUSD = account.svUSD;
    snapshot.svUSDLiquidityUSD = account.svUSDLiquidityUSD;
    snapshot.svUSDBins = account.svUSDBins;
    snapshot.WBTC = account.WBTC;
    snapshot.svBTC = account.svBTC;
    snapshot.svBTCLiquidityUSD = account.svBTCLiquidityUSD;
    snapshot.svBTCBins = account.svBTCBins;
    snapshot.WETH = account.WETH;
    snapshot.svETH = account.svETH;
    snapshot.svETHLiquidityUSD = account.svETHLiquidityUSD;
    snapshot.svETHBins = account.svETHBins;
    snapshot.totalLiquidityUSD = account.totalLiquidityUSD;
    snapshot.blockNumber = block.number;
    snapshot.timestamp = block.timestamp;
    snapshot.save();
    return snapshot;
}


