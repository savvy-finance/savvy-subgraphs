import { BigInt } from "@graphprotocol/graph-ts";

export function ascendingComparator(x: BigInt, y: BigInt): number {
    return x.minus(y).toU32();
}

export function checkArrayIsAscSorted(bins: BigInt[]): BigInt[] {
    let isSorted = true;
    for (let i = 1; i < bins.length; i++) {
        if (bins[i] < bins[i - 1]) {
            isSorted = false;
            break;
        }
    }

    if (isSorted) {
        // return early to avoid unnecessary sort
        return bins;
    }

    return bins.sort();
}

export function mergeSortedArrays(arr1: BigInt[], arr2: BigInt[]): BigInt[] {
    if (arr1.length === 0) {
        return arr2;
    } else if (arr2.length === 0) {
        return arr1;
    }
    
    const sortedArr: BigInt[] = [];
    let sortedArrIdx = -1;
    let idx1 = 0;
    let idx2 = 0;
    while (idx1 < arr1.length && idx2 < arr2.length) {
        if (sortedArrIdx >= 0 && sortedArr[sortedArrIdx].equals(arr1[idx1])) {
            idx1++;
            continue;
        } else if (sortedArrIdx >= 0 && sortedArr[sortedArrIdx].equals(arr2[idx2])) {
            idx2++;
            continue;
        } else if (arr1[idx1].equals(arr2[idx2])) {
            sortedArr.push(arr1[idx1]);
            idx1++;
            idx2++;
        } else if (arr1[idx1].lt(arr2[idx2])) {
            sortedArr.push(arr1[idx1]);
            idx1++;
        } else { 
            sortedArr.push(arr2[idx2]);
            idx2++;
        }
        sortedArrIdx++;
    }

    while (idx1 < arr1.length) {
        if (sortedArr[sortedArr.length - 1].notEqual(arr1[idx1])) {
            sortedArr.push(arr1[idx1]);
        }
        idx1++;
    }

    while (idx2 < arr2.length) {
        if (sortedArr[sortedArr.length - 1].notEqual(arr2[idx2])) {
            sortedArr.push(arr2[idx2]);
        }
        idx2++;
    }

    return sortedArr;
}