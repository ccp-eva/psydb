import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from '../../date-fns';

import {
    useRecordSlotifier,
    wrapSelectCallbacks,
} from './utils';

import TimeSlot from './time-slot';

const TimeSlotList = ({
    studyRecord,
    locationRecord,
    teamRecords,
    reservationRecords,
    experimentRecords,
    dayStart,
    startTimeInt,
    endTimeInt,
    slotDuration,
    
    subjectRecordType,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {
    var start = new Date(dayStart.getTime() + startTimeInt);
    var end = new Date(dayStart.getTime() + endTimeInt);

    var { _id: locationId } = locationRecord;

    var slotify = useRecordSlotifier({
        locationId, start, end, slotDuration
    });
    var slottedReservationRecords = slotify(reservationRecords);
    var slottedExperimentRecords = slotify(experimentRecords)

    console.log({ slottedReservationRecords, reservationRecords });

    var slots = useMemo(() => {
        var tmp = [];
        for (var t = start.getTime(); t < end.getTime(); t += slotDuration) {
            tmp.push({
                timestamp: t,
                reservationRecord: slottedReservationRecords[t].item,
                experimentRecord: slottedExperimentRecords[t].item,
            });
        }
        return tmp;
    }, [ slottedReservationRecords, slottedExperimentRecords ]);

    //console.log(slots);

    var wrapped = wrapSelectCallbacks({
        onSelectEmptySlot,
        onSelectReservationSlot,
        onSelectExperimentSlot,

        reservationRecords,
        experimentRecords,
        slotDuration,
        upperBoundary: end
    });

    var sharedSlotProps = {
        slotDuration,
        studyRecord,
        locationRecord,
        teamRecords,
        
        subjectRecordType,
        
        onSelectEmptySlot: wrapped.onSelectEmptySlot,
        onSelectReservationSlot: wrapped.onSelectReservationSlot,
        onSelectExperimentSlot: wrapped.onSelectExperimentSlot,
    }

    return (
        <div>
            <header className='text-center bg-light border-bottom'>
                <div><b>{ datefns.format(start, 'cccccc dd.MM.') }</b></div>
                <div>Uhrzeit</div>
            </header>
            { slots.map(
                ({
                    timestamp,
                    reservationRecord,
                    experimentRecord
                }) => (
                    <TimeSlot key={ timestamp } { ...({
                        timestamp,
                        reservationRecord,
                        experimentRecord,

                        ...sharedSlotProps
                    })} />
                )
            )}
        </div>
    )
}


export default TimeSlotList;
