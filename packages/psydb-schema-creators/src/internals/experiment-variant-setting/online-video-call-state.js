'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    CustomRecordTypeKey,
    Integer,
    DefaultArray,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var OnlineVideoCallState = () => {
    return ExactObject({
        properties: {
            subjectTypeKey: CustomRecordTypeKey({
                title: 'Probandentyp',
                collection: 'subject',
            }),
            subjectsPerExperiment: Integer({
                title: 'Probanden pro Experiment',
                default: 1,
                minimum: 1,
            }),
            subjectEqualityInFields: DefaultArray({
                // this has to be checked later on
                // in the message handler
                items: JsonPointer(),
            })
        },
        required: [
            'subjectTypeKey',
            'subjectsPerExperiment',
            'subjectEqualityInFields',
        ]
    });
}

module.exports = OnlineVideoCallState;
