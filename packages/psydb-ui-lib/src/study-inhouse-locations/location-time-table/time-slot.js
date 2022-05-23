import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import datefns from '../../date-fns';

import {
    ExperimentSlot,
    ReservationSlot,
    EmptySlot,
    DisabledSlot
} from './time-slot-variants';

const TimeSlot = (ps) => {
    var {
        experimentRecord,
        reservationRecord,
        
        isFirstSlotOfExperiment,

        onSelectExperimentSlot,
        onSelectReservationSlot,
        onSelectEmptySlot,
        showPast,
        ...downstream
    } = ps;

    var { timestamp } = downstream;

    var permissions = usePermissions();
    var canCreateReservationsWithinTheNext3Days = (
        permissions.hasFlag('canCreateReservationsWithinTheNext3Days')
    );
    var canCreateExperimentsWithinTheNext3Days = (
        permissions.hasFlag('canCreateExperimentsWithinTheNext3Days')
    );

    var now = new Date();
    if (experimentRecord) {
        var end = experimentRecord.state.interval.end;
        var isInPast = new now.getTime() > new Date(end).getTime();
        var isWithin3days = (
            datefns.add(now, { days: 3 }).getTime() > dayEnd.getTime()
        );
        var shouldEnable = (
            !isInPast
            && canCreateExperimentsWithinTheNext3Days ? true : !isWithin3days
            // && !([6,7].includes(dayIndex))
        );
        if (!showPast && !shouldEnable) {
            return <DisabledSlot />
        }
        return (
            <ExperimentSlot { ...({
                isFirstSlotOfExperiment,
                experimentRecord,
                onSelectExperimentSlot,
                ...downstream
            })} />
        )
    }
    else if (reservationRecord) {
        //var end = reservationRecord.state.interval.end;
        var isInPast = now.getTime() > timestamp;
        var isWithin3days = (
            datefns.add(now, { days: 3 }).getTime() > timestamp
        );
        var shouldEnable = (
            !isInPast
            && canCreateExperimentsWithinTheNext3Days ? true : !isWithin3days
            // && !([6,7].includes(dayIndex))
        );
        if (!showPast && !shouldEnable) {
            return <DisabledSlot />
        }
        return (
            <ReservationSlot {...({
                reservationRecord,
                onSelectReservationSlot,
                ...downstream
            })} />
        )
    }
    else {
        var isInPast = now.getTime() > timestamp;
        var isWithin3days = (
            datefns.add(now, { days: 3 }).getTime() > timestamp
        );
        var shouldEnable = (
            !isInPast
            && canCreateReservationsWithinTheNext3Days ? true : !isWithin3days
            // && !([6,7].includes(dayIndex))
        );
        if (!showPast && !shouldEnable) {
            return <DisabledSlot />
        }
        return (
            <EmptySlot { ...({
                onSelectEmptySlot,
                ...downstream,
            }) } />
        )
    }
}

export default TimeSlot;
