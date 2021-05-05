'use strict';
var InvitationStatus = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'ParticipationStatus',
    type: 'string',
    enum: [
        'unknown',
        'scheduled',
        'confirmed',
        'mailbox', // XXX is that even a thing?
        'contact-failed',
    ],

    // FIXME: rjsf
    enumNames: [
        'unbekannt',
        'geplant',
        'bestätigt',
        'Anrufbeantworter',
        'nicht erreicht',
    ],

    default: 'unknown',
    ...additionalKeywords,
})

module.exports = InvitationStatus;
