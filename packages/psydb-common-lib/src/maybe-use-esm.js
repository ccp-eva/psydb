'use strict';
var maybeUseESM = (maybe_ESM) => {
    var out = maybe_ESM.default || maybe_ESM;
    return out;
}

module.exports = maybeUseESM;
