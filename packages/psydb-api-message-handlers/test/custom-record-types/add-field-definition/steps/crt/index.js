'use strict';
var create = require('./create');
var addFieldDefinition = require('./add-field-definition');

var CRT = (cacheKey) => {
    var out = {};

    for (var fnkey of [
        'addFieldDefinition'
    ]) {
        out[fnkey] = (bag) => (
            CRT[fnkey]({ withCachedCRT: cacheKey, ...bag })
        )
    }

    return out;
}

CRT.create = (collection, ...pass) => (
    create[collection](...pass)
);

CRT.addFieldDefinition = ({ systemType, ...pass }) => (
    addFieldDefinition[systemType]({ ...pass })
);

module.exports = CRT;
