'use strict';
var create = require('./create');
var addFieldDefinition = require('./add-field-definition');
var createRecord = require('./create-record');

var CRT = (...args) => {
    var argsBag = undefined;
    if (args.length === 1) {
        var [ cacheKey ] = args;
        argsBag = { withCachedCRT: cacheKey }
    }
    else if (args.length === 2) {
        var [ collection, recordType ] = args;
        argsBag = { collection, recordType }
    }
    else {
        throw new Error(
            'either provide [cacheKey] or [collection,recordType] as args'
        );
    }

    var out = {};

    out.addFieldDefinition = (fnBag) => (
        CRT.addFieldDefinition({ ...argsBag, ...fnBag })
    );
    out.createRecord = (data, options = {}) => (
        createRecord({ ...argsBag, data, ...options })
    );

    return out;
}

CRT.create = (collection, ...pass) => (
    create[collection](...pass)
);

CRT.addFieldDefinition = ({ systemType, ...pass }) => (
    addFieldDefinition[systemType]({ ...pass })
);

module.exports = CRT;
