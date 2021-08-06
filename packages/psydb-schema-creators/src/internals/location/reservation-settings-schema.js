'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignId,
    TimeInterval,
    Time,
    WeekdayBoolObject,
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
                    const: false,
                    default: false, // because rjsf
                },
                excludedExperimentWeekdays: WeekdayBoolObject({
                    title: 'Termine nicht am',
                }),
            },
            required: [
                'canBeReserved',
                'excludedExperimentWeekdays'
            ]
        }),
        ExactObject({
            title: 'reservierbar',
            properties: {
                canBeReserved: {
                    type: 'boolean',
                    const: true,
                    default: true, // because rjsf
                },
                
                possibleReservationWeekdays: WeekdayBoolObject({
                    title: 'Wochentage',
                }),
                possibleReservationTimeInterval: TimeInterval({
                    title: 'Reservierbar Von/Bis',
                    startKeywords: {
                        title: 'Reservierbar Von',
                    },
                    endKeywords: {
                        title: 'Reservierbar Bis'
                    }
                }),

                reservationSlotDuration: Time({
                    title: 'Länge der Zeit-Slots',
                    minimum: 15*60*1000, // 15 minutes
                    maximum: 4*60*60*1000, // 4 hours (arbitrary)
                    //multipleOf: 15*60*1000, // 15 minutes
                }),
                
                timezone: {
                    title: 'Zeitzone',
                    type: 'string',
                    const: 'Europe/Berlin',
                    default: 'Europe/Berlin',
                }
            },
            required: [
                'canBeReserved',
                //'canBeReservedByResearchGroupIds',
                //'disabledForReservationIntervals',
                'possibleReservationTimeInterval',
                'reservationSlotDuration',
                'timezone',
            ],
        })
    ]

};

module.exports = reservationSettingsSchema;
