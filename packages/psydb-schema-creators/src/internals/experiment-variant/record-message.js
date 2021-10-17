'use strict';
var {
    ForeignId,
    ExperimentVariantEnum
} = require('@mpieva/psydb-schema-fields');

var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var ExperimentVariantRecordMessage = ({
    op, // create/patch/delete
    type,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'experimentVariant',
        type,
        stateSchemaCreator: internals.ExperimentVariantState,
        staticCreatePropSchemas: {
            type: ExperimentVariantEnum(),
            studyId: ForeignId({
                collection: 'study',
            }),
        }
    })
}

module.exports = ExperimentVariantRecordMessage;
