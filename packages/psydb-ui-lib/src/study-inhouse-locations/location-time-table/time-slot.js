import React from 'react';

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

    if (experimentRecord) {
        var end = experimentRecord.state.interval.end;
        var isInPast = new Date().getTime() > new Date(end).getTime();
        if (!showPast && isInPast) {
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
        var end = reservationRecord.state.interval.end;
        var isInPast = new Date().getTime() > timestamp;
        if (!showPast && isInPast) {
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
        var isInPast = new Date().getTime() > timestamp;
        if (!showPast && isInPast) {
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
