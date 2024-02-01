'use strict';
var {
    ForeignId,
    LabMethodKey,
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
            type: LabMethodKey(),
            studyId: ForeignId({
                collection: 'study',
            }),
        }
    })
}

module.exports = ExperimentVariantRecordMessage;
