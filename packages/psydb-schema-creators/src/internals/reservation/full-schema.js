'use strict';
var {
    ExactObject,
    ForeignId,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var AwayTeamState = require('./away-team-state');
var InhouseState = require('./inhouse-state');

var FullSchema = ({ enableInternalProps } = {}) => ({
    oneOf: [
        ExactObject({
            type: StringEnum({ const: 'awayTeam' }),
            properties: {
                state: AwayTeamState({ enableInternalProps })
            },
            required: [ 'state' ]
        }),
        ExactObject({
            type: StringEnum({ const: 'inhouse' }),
            properties: {
                state: InhouseState({ enableInternalProps })
            },
            required: [ 'state' ]
        }),
    ]
});

module.exports = FullSchema;
