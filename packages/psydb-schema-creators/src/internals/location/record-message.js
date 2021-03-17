'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var LocationRecordMessage = ({
    op, // create/patch/delete
    type,
    customFieldDefinitions,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'location',
        type,
        customFieldDefinitions,
        stateSchemaCreator: internals.LocationState
    })
}

module.exports = LocationRecordMessage;
