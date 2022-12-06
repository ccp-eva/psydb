'use strict';
var hasNone = (ary) => {
    if (!Array.isArray(ary)) {
        throw new Error('hasNone() requires an array');
    }
    return ( ary.length === 0 );
}

module.exports = hasNone;
