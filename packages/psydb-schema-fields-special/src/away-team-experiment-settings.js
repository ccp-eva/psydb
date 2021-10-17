'use strict';
var {
    ExactObject,
    DefaultBool,
    Integer,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var ExternalLocationGrouping = require('./external-location-grouping');

var AwayTeamExperimentSettings = () => {
    return {
        type: 'object',
        title: 'Externe-Termine',
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
                    subjectLocationFieldPointer: JsonPointer({
                        systemType: 'SubjectLocationFieldPointer',
                    });
                },
                required: [
                    'enabled',
                    'subjectLocationFieldPointer',
                ]
            }),
        ],
    }
}

module.exports = AwayTeamExperimentSettings;
