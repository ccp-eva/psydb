'use strict';
var ParticipationStatus = () => ({
    systemType: 'ParticipationStatus',
    type: 'string',
    enum: [
        'unknown',
        'participated',
        'showed-up-but-didnt-participate',
        'did-show-up', // XXX is that even a thing?
        'didnt-show-up',
        'canceled-by-participant',
        'canceled-by-institute', // aka we uninvited the subject
    ],
    default: 'unknown'
})

module.exports = ParticipationStatus;
