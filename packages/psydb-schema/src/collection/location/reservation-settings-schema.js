'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
    TimeInterval,
} = require('@mpieva/psydb-schema-fields');

var reservationSettingsSchema = {
    oneOf: [
        ExactObject({
            properties: {
                canBeReserved: {
                    type: 'boolean',
                    enum: [ false ],
                    default: false, // because rjsf
                },
            },
            required: [ 'canBeReserved' ]
        }),
        ExactObject({
            properties: {
                canBeReserved: {
                    type: 'boolean',
                    enum: [ true ],
                    default: true, // because rjsf
                },
                canBeReservedByResearchGroupIds: {
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
                'canBeReserved',
                'canBeReservedByResearchGroupIds',
                'disabledForReservationIntervals',
                'possibleReservationTimeInterval',
                'reservationSlotDuration',
            ],
        })
    ]

};

module.exports = reservationSettingsSchema;
