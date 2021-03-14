'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var LocationRecordMessage = ({
    op, // create/patch/delete
    customFieldDefinitions,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'location',
        customFieldDefinitions,
        stateSchemaCreator: internals.LocationState
    })
}

module.exports = LocationRecordMessage;
