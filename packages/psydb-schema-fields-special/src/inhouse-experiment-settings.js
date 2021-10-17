'use strict';
var {
    ExactObject,
    DefaultBool,
    Integer,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var InhouseExperimentSettings = () => {
    return {
        title: 'Interne-Termine',
        lazyResolveProp: 'enabled',
        oneOf: [
            ExactObject({
                title: 'Nein',
                properties: {
                    enabled: DefaultBool({ const: false }),
                },
                required: [
                    'enabled',
                ]
            }),
            ExactObject({
                title: 'Ja',
                properties: {
                    enabled: DefaultBool({ const: true }),
                    subjectsPerExperiment: Integer({
                        title: 'Probanden pro Experiment',
                        default: 1,
                        minimum: 1,
                    }),
                    subjectEqualityInFields: DefaultArray({
                        title: 'gleiche Eigenschaften',
                        // this has to be checked later on
                        // in the message handler
                        items: JsonPointer({
                            systemType: 'SubjectTypeFieldPointers',
                            systemProps: {
                                // TODO:
                                subjectType: { $data: '2/path/to/type/data' }
                            }
                        }),
                    }),
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
                            }
                        })
                    })
                },
                required: [
                    'enabled',
                    'subjectsPerExperiment',
                    'subjectEqualityInFields',
                ]
            }),
        ],
    }
}

module.exports = InhouseExperimentSettings;
