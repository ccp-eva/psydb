'use strict';
var { customRecordTypeCollections } = require('@mpieva/psydb-schema-enums');

var CustomRecordTypeCollectionEnum = (bag = {}) => {
    var { ...extraKeywords } = bag;
    var { keys, names } = customRecordTypeCollections;
    
    var schema = {
        type: 'string',
        systemType: 'CustomRecordTypeCollectionEnum',
        enum: keys,
        enumNames: names,

        ...extraKeywords,
    }

    return schema;
}

module.exports = CustomRecordTypeCollectionEnum;
