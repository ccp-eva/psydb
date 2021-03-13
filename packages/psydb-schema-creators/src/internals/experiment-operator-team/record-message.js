'use strict';

/*var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');*/

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var ExperimentOperatorTeamRecordMessage = ({
    op, // create/patch/delete
    //customStateSchema,
}) => {
    return SingleChannelRecordMessage({
        op,
        staticCreatePropSchemas: {
            'studyId': ForeignId({ collection: 'study' })
        },
        //customStateSchema,
        createStateSchemaCallback: ExperimentOperatorTeamState
    })
}

