'use strict';
var {
    ForeignId,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var AgeFrameRecordMessage = ({
    op, // create/patch/delete
    type,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'ageFrame',
        type,
        stateSchemaCreator: internals.AgeFrameState,
        staticCreatePropSchemas: {
            subjectTypeKey: CustomRecordTypeKey({
                collection: 'subject',
            }),
            studyId: ForeignId({
                collection: 'study',
            }),
            subjectSelectorId: ForeignId({
                collection: 'subjectSelector',
            }),
        }
    })
}

module.exports = AgeFrameRecordMessage;
