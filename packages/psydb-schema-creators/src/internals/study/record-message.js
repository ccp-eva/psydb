'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var StudyRecordMessage = ({
    op, // create/patch/delete
    type,
    //customFieldDefinitions,
    propsSchema,
}) => {
    return SingleChannelRecordMessage({
        op,
        propsSchema,
        collection: 'study',
        type,
        /*customFieldDefinitions,
        stateSchemaCreator: internals.StudyState*/
    })
}

module.exports = StudyRecordMessage;
