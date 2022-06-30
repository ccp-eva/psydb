'use strict';
var checkIsWithin3Days = require('./check-is-within-3-days');

var checkShouldEnableCalendarSlotTypes = (bag) => {
    var { permissions, refDate, calendarVariant  } = bag;
    refDate = refDate ? new Date(refDate) : refDate;

    var canCreateReservationsWithinTheNext3Days = (
        permissions.hasFlag('canCreateReservationsWithinTheNext3Days')
    );
    var canCreateExperimentsWithinTheNext3Days = (
        permissions.hasFlag('canCreateExperimentsWithinTheNext3Days')
    );

    var now = new Date();
    var isInPast = now.getTime() > refDate.getTime();
    var isWithin3Days = checkIsWithin3Days(refDate);

    var out = {
        experiment: false,
        reservation: false,
    };

    switch (calendarVariant) {
        case 'reservation':
            out.reservation = (
                !isInPast
                && (
                    canCreateReservationsWithinTheNext3Days
                    ? true
                    : !isWithin3Days
                )
            );
            return out;

        case 'experiment':
        default:
            out.experiment = (
                !isInPast
                && (
                    canCreateExperimentsWithinTheNext3Days
                    ? true
                    : !isWithin3Days
                )
            );
            return out;
    }
}

module.exports = checkShouldEnableCalendarSlotTypes; 
