'use strict';
var hasSome = (ary, options = {}) => {
    var { strict = true } = options;
    if (!Array.isArray(ary)) {
        if (strict) {
            throw new Error('hasSome() requires an array');
        }
        else {
            return false;
        }
    }
    return ( ary.length > 0 );
}

module.exports = hasSome;
