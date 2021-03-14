'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var StudyRecordMessage = ({
    op, // create/patch/delete
    customFieldDefinitions,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'study',
        customFieldDefinitions,
        stateSchemaCreator: internals.StudyState
    })
}

module.exports = StudyRecordMessage;
