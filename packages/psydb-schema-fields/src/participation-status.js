'use strict';
var ParticipationStatus = ({
    ...additionalKeywords
} = {}) => ({
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

    // FIXME: rjsf
    enumNames: [
        'unbekannt',
        'teilgenommen',
        'nicht teilgenommen',
        'nur erschienen',
        'nicht erschienen',
        'abgesagt',
        'ausgeladen'
    ],

    default: 'unknown',
    ...additionalKeywords,
})

module.exports = ParticipationStatus;
