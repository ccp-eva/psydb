'use strict';
var {
    ExactObject,
    DefaultBool,
    Integer,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var OnlineVideoCallSettings = () => {
    return {
        type: 'object',
        title: 'Video-Calls',
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
                        // this has to be checked later on
                        // in the message handler
                        items: JsonPointer(),
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

module.exports = OnlineVideoCallSettings;
