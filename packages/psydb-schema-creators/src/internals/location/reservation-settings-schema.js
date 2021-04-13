'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
    TimeInterval,
} = require('@mpieva/psydb-schema-fields');

var reservationSettingsSchema = {
    type: 'object',
    title: 'Reservierbarkeit',
    lazyResolveProp: 'canBeReserved',
    oneOf: [
        ExactObject({
            title: 'nicht reservierbar',
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
            title: 'reservierbar',
            properties: {
                canBeReserved: {
                    type: 'boolean',
                    enum: [ true ],
                    default: true, // because rjsf
                },
                canBeReservedByResearchGroupIds: {
                    title: 'Reservierbar durch Forschungsgruppen',
                    type: 'array',
                    default: [],
                    items: ForeignId({
                        collection: 'researchGroup'
                    }),
                },
                disabledForReservationIntervals: {
                    title: 'Nicht reservierbar im Zeitraum',
                    description: 'zum Beispiel bei Bauarbeiten',
                    type: 'array',
                    default: [],
                    items: DateTimeInterval(),
                },

                possibleReservationTimeInterval: TimeInterval({
                    title: 'Reserverierbarer Zetraum pro Tag',
                }),

                reservationSlotDuration: {
                    title: 'Länge der Reservierungs-Slots',
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
