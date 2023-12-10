'use strict';
var { arrify } = require('@mpieva/psydb-core-utils');

// [
//    (false && 'some-conditional'),
//    'foo',
//    () => (42),
//    [1,2,3]
// ]
// => [ 'foo', 42, [1,2,3] ]
// when spreadArrayItems === true
// => [ 'foo', 42, 1, 2, 3 ]
//
// NOTE: im not sure if spreadArrayItems = true should be on by default
// becuase we mainly use it in stage compositions and we have functions
// that return an array of multiple stages relatively often

var SmartArray = (ary, options = {}) => {
    var { spreadArrayItems = false } = options;
    var out = [];
    for (var it of ary) {
        if (it) {
            if (typeof it === 'function') {
                it = it();
            }

            out.push(...(
                spreadArrayItems
                ? arrify(it)
                : [ it ]
            ));
        }
    }
    return out;
}

module.exports = SmartArray;
