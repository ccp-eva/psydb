'use strict';
var hasSome = (ary) => {
    if (!Array.isArray(ary)) {
        throw new Error('hasSome() requires an array');
    }
    return ( ary.length > 0 );
}

module.exports = hasSome;
