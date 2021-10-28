'use strict';
var {
    ExactObject,
    Id,
    ForeignId,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var internals = require('../');

var AgeFrameFullSchema = () => ExactObject({
    properties: {
        _id: Id(),
        subjectTypeKey: CustomRecordTypeKey({
            collection: 'subject',
        }),
        studyId: ForeignId({
            collection: 'study',
        }),
        subjectSelectorId: ForeignId({
            collection: 'subjectSelector',
        }),
        state: internals.AgeFrameState(),

        events: { type: 'array' },
    },
    required: [
        'subjectTypeKey',
        'studyId',
        'subjectSelectorId',
    ]
})


module.exports = AgeFrameFullSchema;
