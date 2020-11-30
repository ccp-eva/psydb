'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix');

var {
    ForeignId,

    SaneString,
    Color,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var createExperimentOperatorTeamState = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/state`,
        type: 'object',
        properties: {
            name: SaneString(),
            color: Color(),
            personnelIds: {
                type: 'array',
                minItems: 1,
                items: ForeignId('personnelScientific'),
            },
            interals: {
                type: 'object',
                properties: {
                    studyId: ForeignId('study'),
                    reservations: {
                        type: 'array',
                        default: [],
                        items: {
                            type: 'object',
                            properties: {
                                studyId: ForeignId('study'),
                                interval: DateTimeInterval(),
                            },
                            required: [
                                'studyId',
                                'interval',
                            ]
                        }
                    },
                },
                required: [
                    'studyId',
                    'availaibility',
                ],
            },
        },
        required: [
            'name',
            'color',
            'personnelIds',
        ],
    }

    return schema;
};

module.exports = createExperimentOperatorTeamState;
