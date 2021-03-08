'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix');

var {
    ForeignId,

    SaneString,
    Color,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var ExperimentOperatorTeamState = ({
    enableInternalProps
} = {}) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/state`,
        type: 'object',
        properties: {
            name: SaneString(),
            color: Color(),
            studyId: ForeignId({
                collection: 'study',
            }),
            personnelIds: {
                type: 'array',
                minItems: 1,
                items: ForeignId({
                    collection: 'personnel',
                    custom: true
                }),
            },
            ...(enableInternalProps && {
                // anything here?
            })
        },
        required: [
            'name',
            'color',
            'studyId',
            'personnelIds',
            ...(
                enableInternalProps
                ? [ /* ??? */ ]
                : []
            ),
        ],
    }

    return schema;
};

module.exports = ExperimentOperatorTeamState;
