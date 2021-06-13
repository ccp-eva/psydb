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
        
        // FIXME: im not sure if that should actually be
        // in invitation status
        'canceled-by-participant',
        'canceled-by-institute', // aka we uninvited the subject
        'deleted-by-institute', // XXX: we deleted the thing i guess??
    ],

    // FIXME: rjsf
    enumNames: [
        'unbekannt',
        'teilgenommen',
        'nicht teilgenommen',
        'nur erschienen',
        'nicht erschienen',
        'abgesagt',
        'ausgeladen',
        'gelöscht',
    ],

    default: 'unknown',
    ...additionalKeywords,
})

module.exports = ParticipationStatus;
