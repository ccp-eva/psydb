'use strict';
// credits to
// https://github.com/mgechev/javascript-algorithms/blob/master/src/sorting/quicksort.js


//MIT License
//
//Copyright (c) 2018 Minko Gechev
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

/**
* The quicksort algorithm. It's complexity is O(nlog n).
*
* @public
*/
var quickSort = (function () {

    function compare(a, b) {
      return a - b;
    }

    /**
     * Swap the places of two elements
     *
     * @private
     * @param {array} array The array which contains the elements
     * @param {number} i The index of the first element
     * @param {number} j The index of the second element
     * @returns {array} array The array with swaped elements
     */
    function swap(array, i, j) {
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
      return array;
    }

    /**
     * Partitions given subarray using Lomuto's partitioning algorithm.
     *
     * @private
     * @param {array} array Input array
     * @param {number} left The start of the subarray
     * @param {number} right The end of the subarray
     */
    function partition(array, left, right, compare) {
      var cmp = array[right - 1];
      var minEnd = left;
      var maxEnd;
      for (maxEnd = left; maxEnd < right - 1; maxEnd += 1) {
	if (compare(array[maxEnd], cmp) < 0) {
	  swap(array, maxEnd, minEnd);
	  minEnd += 1;
	}
      }
      swap(array, minEnd, right - 1);
      return minEnd;
    }

    /**
     * Sorts given array.
     *
     * @private
     * @param {array} array Array which should be sorted
     * @param {number} left The start of the subarray which should be handled
     * @param {number} right The end of the subarray which should be handled
     * @returns {array} array Sorted array
     */
    function quickSort(array, left, right, cmp) {
      if (left < right) {
	var p = partition(array, left, right, cmp);
	quickSort(array, left, p, cmp);
	quickSort(array, p + 1, right, cmp);
      }
      return array;
    }

    /**
     * Calls the quicksort function with it's initial values.
     *
     * @public
     * @param {array} array The input array which should be sorted
     * @returns {array} array Sorted array
     */
    return function (array, cmp) {
      cmp = cmp || compare;
      return quickSort(array, 0, array.length, cmp);
    };

}());

module.exports = quickSort;
