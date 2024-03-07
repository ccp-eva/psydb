'use strict';

var _prefix = (base, suffix) => (
    base === false
    ? suffix
    : `${base}.${suffix}`
)

var extendAnonTPrefix = (...args) => {
    return { anonTPrefix: _prefix(...args) };
}

extendAnonTPrefix.factory = (base, options = {}) => {
    var { prop } = options;

    if (prop) {
        return (suffix) => extendAnonTPrefix(base, suffix)
    }
    else {
        return (suffix) => _prefix(base, suffix)
    }
}

module.exports = extendAnonTPrefix;
