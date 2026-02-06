'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var ParticipationStatus = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'ParticipationStatus',
    type: 'string',
    enum: [
        ...enums.participationStatus.keys,
        ...enums.unparticipationStatus.keys,
    ],

    // FIXME: rjsf
    enumNames: [
        ...enums.participationStatus.names,
        ...enums.unparticipationStatus.names,
    ],

    default: 'unknown',
    ...additionalKeywords,
})

module.exports = ParticipationStatus;
