'use strict';
var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var internals = require('../');

var ExperimentOperatorTeamRecordMessage = ({
    op, // create/patch/delete
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'experimentOperatorTeam',
        staticCreatePropSchemas: {
            'studyId': ForeignId({ collection: 'study' })
        },
        stateSchemaCreator: internals.ExperimentOperatorTeamState
    })
}

module.exports = ExperimentOperatorTeamRecordMessage;
