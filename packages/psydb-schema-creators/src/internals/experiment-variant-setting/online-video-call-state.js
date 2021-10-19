'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    CustomRecordTypeKey,
    Integer,
    DefaultArray,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var { SubjectFieldRequirementList } = require('./utils');

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
            subjectFieldRequirements: SubjectFieldRequirementList(),
        },
        required: [
            'subjectTypeKey',
            'subjectsPerExperiment',
            'subjectFieldRequirements',
        ]
    });
}

module.exports = OnlineVideoCallState;
