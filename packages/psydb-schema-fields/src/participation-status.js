'use strict';
var ParticipationStatus = () => ({
    type: { enum: [
        'participated',
        'showed-up-but-didnt-participate',
        'didnt-show-up',
        'canceled-by-participant',
        'canceled-by-institute', // aka we uninvited the subject
    ]},
})

module.exports = ParticipationStatus;
