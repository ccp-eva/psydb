'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var ExternalPersonRecordMessage = ({
    op, // create/patch/delete
    type,
    customFieldDefinitions,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'externalPerson',
        type,
        customFieldDefinitions,
        stateSchemaCreator: internals.ExternalPersonState
    })
}

module.exports = ExternalPersonRecordMessage;
