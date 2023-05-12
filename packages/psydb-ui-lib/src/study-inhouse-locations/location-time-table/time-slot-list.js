import React, { useState, useEffect, useReducer, useMemo } from 'react';
import intervalfns from '@mpieva/psydb-date-interval-fns';
import {
    checkIsWithin3Days,
    checkShouldEnableCalendarSlotTypes,
} from '@mpieva/psydb-common-lib';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import datefns from '../../date-fns';

import {
    useRecordSlotifier,
    wrapSelectCallbacks,
} from './utils';

import TimeSlot from './time-slot';

const TimeSlotList = ({
    variant,

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
    desiredTestInterval,
    testableIntervals,

    __useNewCanSelect,
    checkEmptySlotSelectable,
    checkReservationSlotSelectable,
    checkExperimentSlotSelectable,

    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
    
    calculateNewExperimentMaxEnd,
    showPast,
    showHeader = true,
}) => {
    var permissions = usePermissions();

    var start = new Date(dayStart.getTime() + startTimeInt);
    var end = new Date(dayStart.getTime() + endTimeInt);

    var dayStart = start;
    var dayIndex = datefns.getISODay(dayStart);
    var dayEnd = datefns.endOfDay(dayStart);
    
    var dayNoon = datefns.add(dayStart, { hours: 12 }); 
    var enabledSlotTypes = checkShouldEnableCalendarSlotTypes({
        permissions, calendarVariant: variant, refDate: dayNoon
    });
    var shouldEnable = showPast || enabledSlotTypes[variant];


    var isSubjectTestable = false;
    //console.log({ testableIntervals });
    if (testableIntervals) {
        var intersections = intervalfns.intersect(
            [{ start: dayStart, end: dayEnd }],
            testableIntervals
        );
        //console.log({ intersections });
        isSubjectTestable = intersections.length > 0;
    }

    var className = 'text-center border-bottom bg-light';

    if (isSubjectTestable) {
        className = 'text-center text-success border-bottom bg-light';
    }
    if (!shouldEnable) {
        className = 'text-center text-grey border-bottom bg-light'
    }

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
        upperBoundary: end,

        calculateNewExperimentMaxEnd,
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
        
        __useNewCanSelect,
        checkEmptySlotSelectable,
        checkReservationSlotSelectable,
        checkExperimentSlotSelectable,

        onSelectEmptySlot: wrapped.onSelectEmptySlot,
        onSelectReservationSlot: wrapped.onSelectReservationSlot,
        onSelectExperimentSlot: wrapped.onSelectExperimentSlot,
    
        showPast,
        isDayEnabled: shouldEnable
    }

    return (
        <div>
            { showHeader && (
                <header className={ className }>
                    <div><b>{ datefns.format(start, 'cccccc dd.MM.') }</b></div>
                    <div>Uhrzeit</div>
                </header>
            )}
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
