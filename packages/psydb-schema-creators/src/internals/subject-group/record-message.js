'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var SubjectGroupRecordMessage = ({
    op, // create/patch/delete
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'subjectGroup',
        stateSchemaCreator: internals.SubjectGroupState
    })
}

module.exports = SubjectGroupRecordMessage;
