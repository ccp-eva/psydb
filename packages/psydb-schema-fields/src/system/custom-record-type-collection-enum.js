'use strict';
var { customRecordTypeCollections } = require('@mpieva/psydb-schema-enums');

var CustomRecordTypeCollectionEnum = ({ ...additionalProps }) => ({
    systemType: 'CustomRecordTypeCollectionEnum',
    type: 'string',
    enum: customRecordTypeCollections.keys,
    enumNames: customRecordTypeCollections.names,
    ...additionalProps,
});

module.exports = CustomRecordTypeCollectionEnum;
