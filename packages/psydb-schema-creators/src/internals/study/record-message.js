'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var StudyRecordMessage = ({
    op, // create/patch/delete
    type,
    customFieldDefinitions,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'study',
        type,
        customFieldDefinitions,
        stateSchemaCreator: internals.StudyState
    })
}

module.exports = StudyRecordMessage;
