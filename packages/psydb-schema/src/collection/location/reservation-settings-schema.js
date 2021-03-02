'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId,
    DateTimeInterval,
    TimeInterval,
} = require('@mpieva/psydb-schema-fields');

var reservationSettingsSchema = {
    type: 'object',
    properties: {
        canBeReservedByResearchGroup: {
            type: 'array',
            default: [],
            items: ForeignId('researchGroup'),
        },
        disabledForReservationIntervals: {
            type: 'array',
            default: [],
            items: DateTimeInterval(),
        },

        possibleReservationTimeInterval: TimeInterval(),

        reservationSlotDuration: {
            type: 'integer',
            minimum: 15*60*1000, // 15 minutes
            maximum: 4*60*60*1000, // 4 hours (arbitrary)
            multipleOf: 15*60*1000, // 15 minutes
        },
    },
    required: [
        'canBeReservedByInstituteIds',
        'disabledForReservationIntervals',
        'possibleReservationTimeInterval',
        'reservationSlotDuration',
    ],
};

module.exports = reservationSettingsSchema;
