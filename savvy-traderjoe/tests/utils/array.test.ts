import {
    assert,
    describe,
    test  } from "matchstick-as/assembly/index";

import { checkArrayIsAscSorted, mergeSortedArrays } from '../../src/utils/array';
import { BigInt } from "@graphprotocol/graph-ts";

  const EMPTY_ARR: BigInt[] = [];
  const ASC_SORTED_ARR = [BigInt.fromI32(1), BigInt.fromI32(2), BigInt.fromI32(4), BigInt.fromI32(10)];
  const DESC_SORTED_ARR = [BigInt.fromI32(10), BigInt.fromI32(4), BigInt.fromI32(2), BigInt.fromI32(1)];
  const UNSORTED_ARR1 = [BigInt.fromI32(4), BigInt.fromI32(2), BigInt.fromI32(10), BigInt.fromI32(1)];
  const UNSORTED_ARR2 = [BigInt.fromI32(6), BigInt.fromI32(4), BigInt.fromI32(9), BigInt.fromI32(7), BigInt.fromI32(5)];
  const MERGED_ARR = [BigInt.fromI32(1), BigInt.fromI32(2), BigInt.fromI32(4), BigInt.fromI32(5), BigInt.fromI32(6), BigInt.fromI32(7), BigInt.fromI32(9), BigInt.fromI32(10)];

  describe("Array utils test", () => {
    describe("checkArrayIsAscSorted", () => {
        test("should handle empty array correctly", () => {
            assert.assertTrue(checkArrayIsAscSorted(EMPTY_ARR).length === 0)
        });
        
        test("should handle already ascending array", () => {
            const result: BigInt[] = checkArrayIsAscSorted(ASC_SORTED_ARR);
            assert.assertTrue(result.length === ASC_SORTED_ARR.length);
            for (let i = 0; i < result.length; i++) {
                assert.bigIntEquals(result[i], ASC_SORTED_ARR[i]);
            }
        });

        describe("should sort unsorted arrays", () => {
            test("desc sorted array", () => {
                const result: BigInt[] = checkArrayIsAscSorted(DESC_SORTED_ARR);
                assert.assertTrue(result.length === ASC_SORTED_ARR.length);
                for (let i = 0; i < result.length; i++) {
                    assert.bigIntEquals(result[i], ASC_SORTED_ARR[i]);
                }
            });

            test("unsorted array", () => {
                const result: BigInt[] = checkArrayIsAscSorted(UNSORTED_ARR1);
                assert.assertTrue(result.length === ASC_SORTED_ARR.length);
                for (let i = 0; i < result.length; i++) {
                    assert.bigIntEquals(result[i], ASC_SORTED_ARR[i]);
                }
            });
        });
    });

    describe("mergeSortedArrays", () => {
        test("merge where both arrays are empty", () => {
            const result: BigInt[] = mergeSortedArrays(EMPTY_ARR, EMPTY_ARR);
            assert.assertTrue(result.length === 0);
        })

        test("merge where arr1 is empty and arr2 is not empty", () => {
            const sortedArr2 = checkArrayIsAscSorted(UNSORTED_ARR2);
            const result: BigInt[] = mergeSortedArrays(EMPTY_ARR, sortedArr2);
            assert.assertTrue(result.length === sortedArr2.length);
            for (let i = 0; i < result.length; i++) {
                assert.bigIntEquals(result[i], sortedArr2[i]);
            }
        })

        test("merge where arr1 is not empty and arr2 is empty", () => {
            const sortedArr1 = checkArrayIsAscSorted(UNSORTED_ARR1);
            const result: BigInt[] = mergeSortedArrays(sortedArr1, EMPTY_ARR);
            assert.assertTrue(result.length === sortedArr1.length);
            for (let i = 0; i < result.length; i++) {
                assert.bigIntEquals(result[i], sortedArr1[i]);
            }
        })

        test("merge where arr1 and arr2 are sorted", () => {
            const sortedArr1 = checkArrayIsAscSorted(UNSORTED_ARR1);
            const sortedArr2 = checkArrayIsAscSorted(UNSORTED_ARR2);
            const result: BigInt[] = mergeSortedArrays(sortedArr1, sortedArr2);
            assert.assertTrue(result.length === MERGED_ARR.length);
            for (let i = 0; i < result.length; i++) {
                assert.bigIntEquals(result[i], MERGED_ARR[i]);
            }
        })
    })
  }) 