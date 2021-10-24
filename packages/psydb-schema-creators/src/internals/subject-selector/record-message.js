'use strict';
var {
    ForeignId,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var {
    SingleChannelRecordMessage
} = require('@mpieva/psydb-schema-helpers');

var internals = require('../');

var SubjectSelectorRecordMessage = ({
    op, // create/patch/delete
    type,
}) => {
    return SingleChannelRecordMessage({
        op,
        collection: 'subjectSelector',
        type,
        stateSchemaCreator: internals.SubjectSelectorState,
        staticCreatePropSchemas: {
            subjectTypeKey: CustomRecordTypeKey({
                collection: 'subject',
            }),
            studyId: ForeignId({
                collection: 'study',
            }),
        }
    })
}

module.exports = SubjectSelectorRecordMessage;
