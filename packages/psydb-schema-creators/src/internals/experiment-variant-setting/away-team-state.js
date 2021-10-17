'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    CustomRecordTypeKey,
    Integer,
    DefaultArray,
    JsonPointer,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var AwayTeamState = () => {
    return ExactObject({
        properties: {
            subjectTypeKey: CustomRecordTypeKey({
                title: 'Probandentyp',
                collection: 'subject',
            }),
            subjectLocationFieldPointer: JsonPointer({
                systemType: 'SubjectLocationFieldPointer',
            })
        },
        required: [
            'subjectTypeKey',
            'subjectLocationFieldPointer',
        ]
    });
}

module.exports = AwayTeamState;
