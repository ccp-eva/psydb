'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var StudyTopicRecordMessage = ({
    op, // create/patch/delete
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'studyTopic',
        stateSchemaCreator: internals.StudyTopicState,
    })
}

module.exports = StudyTopicRecordMessage;
