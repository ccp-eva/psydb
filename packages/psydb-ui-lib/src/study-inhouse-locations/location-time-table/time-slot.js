import React from 'react';

import {
    ExperimentSlot,
    ReservationSlot,
    EmptySlot
} from './time-slot-variants';

const TimeSlot = (ps) => {
    var {
        experimentRecord,
        reservationRecord,
        
        onSelectExperimentSlot,
        onSelectReservationSlot,
        onSelectEmptySlot,
        ...downstream
    } = ps;

    if (experimentRecord) {
        return (
            <ExperimentSlot { ...({
                experimentRecord,
                onSelectExperimentSlot,
                ...downstream
            })} />
        )
    }
    else if (reservationRecord) {
        return (
            <ReservationSlot {...({
                reservationRecord,
                onSelectReservationSlot,
                ...downstream
            })} />
        )
    }
    else {
        return (
            <EmptySlot { ...({
                onSelectEmptySlot,
                ...downstream,
            }) } />
        )
    }
}

export default TimeSlot;
