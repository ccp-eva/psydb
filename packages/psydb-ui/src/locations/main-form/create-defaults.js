import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const {
    Custom,
    SystemPermissions
} = createFieldDefaults;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const ReservationType = (options) => {
    var { reservationType } = options;
    switch (reservationType) {
        case 'away-team':
            return { excludeExperimentWeekdays: {}}
        case 'away-team':
            return {
                possibleReservationWeekdays: {
                    mon: true, tue: true, wed: true, thu: true, fri: true,
                    sat: false, sun: false
                },
                possibleReservationTimeInterval: {
                    start: 8 * HOUR, end: 16 * HOUR
                },
                reservationSlotDuration: 15 * MINUTE
            }
        case 'no-reservation':
        default:
            return undefined;
    }
}

export const createDefaults = (options) => {
    var { reservationType, fieldDefinitions, permissions } = options;
    return {
        custom: Custom({ fieldDefinitions }),
        reservationSettings: ReservationDefaults({ reservationType }),
        systemPermissions: SystemPermissions({ permissions }),
    }
}
