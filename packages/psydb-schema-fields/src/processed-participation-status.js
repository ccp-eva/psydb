'use strict';
var { unique } = require('@mpieva/psydb-core-utils');
var enums = require('@mpieva/psydb-schema-enums');

var ProcessedParticipationStatus = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'ProcessedParticipationStatus',
    type: 'string',

    enum: unique([
        ...enums.awayTeamParticipationStatus.keys,
        ...enums.awayTeamUnparticipationStatus.keys,
        ...enums.inviteParticipationStatus.keys,
        ...enums.inviteUnparticipationStatus.keys,
    ]),

    // FIXME: rjsf
    enumNames: unique([
        ...enums.awayTeamParticipationStatus.names,
        ...enums.awayTeamUnparticipationStatus.names,
        ...enums.inviteParticipationStatus.names,
        ...enums.inviteUnparticipationStatus.names,
    ]),

    default: 'participated',
    ...additionalKeywords,
})

module.exports = ProcessedParticipationStatus;
