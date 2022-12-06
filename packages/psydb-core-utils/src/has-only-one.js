'use strict';
var hasOnlyOne = (ary) => {
    if (!Array.isArray(ary)) {
        throw new Error('hasOnlyOne() requires an array');
    }
    return ( ary.length === 1 );
}

module.exports = hasOnlyOne;
