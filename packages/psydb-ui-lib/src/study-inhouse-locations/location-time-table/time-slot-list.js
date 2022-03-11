import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from '../../date-fns';

import {
    useRecordSlotifier,
    wrapSelectCallbacks,
} from './utils';

import TimeSlot from './time-slot';

const TimeSlotList = ({
    studyId,
    locationRecord,
    teamRecords,
    reservationRecords,
    experimentRecords,
    
    settingRecords,
    settingRelated,

    dayStart,
    startTimeInt,
    endTimeInt,
    slotDuration,
    
    subjectRecordType,
    currentExperimentId,
    currentSubjectRecord,

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

    var slots = useMemo(() => {
        var tmp = [];
        var visitedExperiments = {};
        for (var t = start.getTime(); t < end.getTime(); t += slotDuration) {
            var reservationRecord = slottedReservationRecords[t].item;
            var experimentRecord = slottedExperimentRecords[t].item;

            var bag = {
                timestamp: t,
                reservationRecord,
                experimentRecord,
            };

            if (experimentRecord) {
                var { _id: expId } = experimentRecord;
                var visited = visitedExperiments[expId];
                if (!visited) {
                    bag.isFirstSlotOfExperiment = true;
                    visitedExperiments[expId] = true;
                }
            }

            tmp.push(bag);

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
        studyId,
        locationRecord,
        teamRecords,
        
        settingRecords,
        settingRelated,
        
        subjectRecordType,
        currentExperimentId,
        currentSubjectRecord,
        
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
                    isFirstSlotOfExperiment,
                    reservationRecord,
                    experimentRecord
                }) => (
                    <TimeSlot key={ timestamp } { ...({
                        timestamp,
                        isFirstSlotOfExperiment,
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
