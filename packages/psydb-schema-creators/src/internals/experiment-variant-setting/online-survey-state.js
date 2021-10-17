'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var OnlineSurveyState = () => {
    return ExactObject({
        properties: {
            subjectTypeKey: CustomRecordTypeKey({
                title: 'Probandentyp',
                collection: 'subject',
            }),
        },
        required: [
            'subjectTypeKey',
        ]
    });
}

module.exports = OnlineSurveyState;
