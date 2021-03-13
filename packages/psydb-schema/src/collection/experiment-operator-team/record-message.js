'use strict';

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var ExperimentOperatorTeamRecordMessage = ({
    type,
    op, // create/patch/delete
    customStateSchema,
}) => {
    RecordMessage({
        op,
        customStateSchema,

        staticCreatePropSchemas: {
            'studyId': ForeignId({ collection: 'study' })
        },
        state: ExperimentOperatorTeamState
    })
}

var SingleChannelRecordMessage (options) => {
    var {
        collection,
        type,
        op,
        staticCreatePropSchemas,

        customStateSchema,
        createStateSchemaCallback,

        //customSubChannelSchemas,
        //createSubChannelStateSchemaCallbacks
    } = params;

    if (!collection) {
        throw new Error('param "collection" is required');
    }
    if (!op) {
        throw new Error('param "op" is required');
    }
    if (!createStateSchemaCallback) {
        throw new Error('param "createStateSchemaCallback" is required');
    }

    switch (op) {
        case 'create':
            return RecordCreateMessage(options);
        case 'patch':
            return RecordPatchMessage(options);
        case 'deleteGdpr':
            return RecordDeleteGdprMessage()
            break;
        default:
            throw new Error(`unknown messgage op ${op}`);
    }
}
