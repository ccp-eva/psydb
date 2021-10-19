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

var { SubjectFieldRequirementList } = require('./utils');

var InhouseState = () => {
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
            subjectFieldRequirements: SubjectFieldRequirements(),
            locations: DefaultArray({
                title: 'Räumlichkeiten',
                items: ExactObject({
                    systemType: 'TypedInhouseLocationId',
                    properties: {
                        // FIXME: InhouseLocationTypeKey
                        customRecordType: CustomRecordTypeKey({
                            title: 'Typ',
                            collection: 'location',
                        }),
                        enabledLocationIds: ForeignId({
                            title: 'Raum',
                            collection: 'location',
                            // TODO: record type $data ??
                        })
                    },
                    required: [
                        'customRecordType',
                        'enabledLocationIds',
                    ]
                })
            })
        },
        required: [
            'subjectTypeKey',
            'subjectsPerExperiment',
            'subjectFieldRequirements',
            'locations',
        ]
    });
}

module.exports = InhouseState;
