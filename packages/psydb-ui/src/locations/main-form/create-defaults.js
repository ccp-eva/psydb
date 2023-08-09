import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const {
    Custom,
    SystemPermissions
} = createFieldDefaults;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const ReservationDefaults = (options) => {
    var { reservationType } = options;
    switch (reservationType) {
        case 'away-team':
            return {
                canBeReserved: false, // FIXME
                excludedExperimentWeekdays: {
                    mon: false, tue: false, wed: false, thu: false, fri: false,
                    sat: false, sun: false
                }
            }
        case 'inhouse':
        default:
            return {
                canBeReserved: true, // FIXME
                possibleReservationWeekdays: {
                    mon: true, tue: true, wed: true, thu: true, fri: true,
                    sat: false, sun: false
                },
                possibleReservationTimeInterval: {
                    start: 8 * HOUR, end: 16 * HOUR
                },
                reservationSlotDuration: 15 * MINUTE,
                timezone: 'Europe/Berlin',
            }
    }
}

export const createDefaults = (options) => {
    var { reservationType, fieldDefinitions, permissions } = options;
    return {
        custom: Custom({ fieldDefinitions }),
        // TODO see location schema creator
        //...(reservationType !== 'no-reservation' && {
        //    reservationSettings: ReservationDefaults({ reservationType }),
        //}),
        reservationSettings: ReservationDefaults({ reservationType }),
        systemPermissions: SystemPermissions({ permissions }),
    }
}
