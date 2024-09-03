'use strict';

var defaultCheckEqual = (a, b) => ( a === b );
var uniquePush = (bag) => {
    var { into: that, values, checkEqual = defaultCheckEqual } = bag;
    for (var v of values) {
        if (!that.find(e => checkEqual(v, e))) {
            that.push(v)
        }
    }
}

module.exports = uniquePush;
