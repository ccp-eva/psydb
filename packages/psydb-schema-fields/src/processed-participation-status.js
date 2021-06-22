'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var ProcessedParticipationStatus = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'ProcessedParticipationStatus',
    type: 'string',
    enum: [
        ...enums.safeParticipationStatus.keys,
        ...enums.safeUnparticipationStatus.keys,
    ],

    // FIXME: rjsf
    enumNames: [
        ...enums.safeParticipationStatus.names,
        ...enums.safeUnparticipationStatus.names,
    ],

    default: 'participated',
    ...additionalKeywords,
})

module.exports = ProcessedParticipationStatus;
