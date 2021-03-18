'use strict';
var inline = require('@cdxoo/inline-text');

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
        type: 'object',
        properties: {
            name: SaneString(),
            color: Color(),
            // is now kept outside of state as it should
            // probably be immutable
            // TODO: should i handle the immutability via enableInternalProps?
            /*studyId: ForeignId({
                collection: 'study',
            }),*/
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
