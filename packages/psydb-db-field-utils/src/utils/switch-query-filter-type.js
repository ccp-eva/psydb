'use strict';

var switchQueryFilterType = (mapping) => (type) => {
    var lambda = mapping[type];
    if (!lambda) {
        throw new Error(`unknown type "${type}"`);
    }
    return lambda;
}

module.exports = switchQueryFilterType;
