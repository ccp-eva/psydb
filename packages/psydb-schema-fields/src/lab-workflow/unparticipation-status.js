'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var UnparticipationStatus = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'UnparticipationStatus',
    type: 'string',
    enum: [
        ...enums.unparticipationStatus.keys,
    ],

    // FIXME: rjsf
    enumNames: [
        ...enums.unparticipationStatus.names,
    ],

    ...additionalKeywords,
})

module.exports = UnparticipationStatus;
