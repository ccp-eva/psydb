'use strict';
var quicksort = require('../quicksort'),
    fn = module.exports = {};

fn.START = '(';
fn.END = ')';

fn.create = (intervals, source) => {

    var bounds = [];
    for (var i = 0; i < intervals.length; i += 1) {
        var interval = intervals[i];
        bounds.push({ 
            value: interval.start,
            type: fn.START,
            source: source
        });
        bounds.push({
            value: interval.end,
            type: fn.END,
            source: source
        });
    };

    return bounds;
};


// with this we got ~40ms (130ms) less
// in comparison to lodashs sortBy
// NOTE: max 10 types atm
fn.sort = (bounds) => {
    var map = {};
    var keys = [];
    for (var i = 0; i < bounds.length; i += 1) {
        var b = bounds[i];

        // we need to track the source in the boundary keys in case
        // the value is equal
        var flag;
        if (b.source === 'set') {
            flag = 0;
        }
        if (b.source === 'other') {
            flag = 1;
        }
        if (flag === undefined) {
            throw('bound flag undefined - source must be (interval|other)');
        }

        // append flag to value for sorting
        map[b.value * 10 + flag] = b;
        keys.push(b.value * 10 + flag);
    }

    var sorted = quicksort(keys);

    bounds = [];
    for (var i = 0; i < sorted.length; i += 1) {
        var k = sorted[i];
        bounds.push(map[k]);
    }
    return bounds;
};

// iterate over flat interval bounds and treat them as parenthesis
// incrementing depth on opening, decrement on closing
fn.each = (bounds, callback) => {
    var depth = 0;
    // using for loop instead of forEach wich is faster
    // i guess the reason is that it has no callback that has
    // to be created
    for (var i = 0; i < bounds.length; i += 1) {
        var b = bounds[i];

        callback(bounds, i, depth);

        if (b.type === '(') {
            depth += 1;
        }
        if (b.type === ')') {
            depth -= 1;
        }
    };
};
