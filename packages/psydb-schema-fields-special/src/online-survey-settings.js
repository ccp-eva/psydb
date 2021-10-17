'use strict';
var {
    ExactObject,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var OnlineSurveySettings = () => {
    return {
        type: 'object',
        title: 'Online-Umfrage',
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
                },
                required: [
                    'enabled',
                ]
            }),
        ],
    }
}

module.exports = OnlineSurveySettings;
