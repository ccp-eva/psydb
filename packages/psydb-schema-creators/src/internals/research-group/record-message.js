'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var ResearchGroupRecordMessage = ({
    op, // create/patch/delete
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'researchGroup',
        stateSchemaCreator: internals.ResearchGroupState
    })
}

module.exports = ResearchGroupRecordMessage;
