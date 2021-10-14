'use strict';
var { collections } = require('@mpieva/psydb-schema-enums');

var CollectionEnum = ({ ...additionalProps }) => ({
    systemType: 'CollectionEnum',
    type: 'string',
    enum: collections.keys,
    enumNames: collections.names,
    ...additionalProps,
});

module.exports = CollectionEnum;
