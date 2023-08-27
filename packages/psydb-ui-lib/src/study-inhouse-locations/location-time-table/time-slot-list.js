import React, { useState, useEffect, useReducer, useMemo } from 'react';
import intervalfns from '@mpieva/psydb-date-interval-fns';
import {
    checkIsWithin3Days,
    checkShouldEnableCalendarSlotTypes,
} from '@mpieva/psydb-common-lib';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import datefns from '../../date-fns';
import CalendarDayHeader from '../../calendar-day-header';

import {
    useRecordSlotifier,
    wrapSelectCallbacks,
} from './utils';

import TimeSlot from './time-slot';

const TimeSlotList = (ps) => {
    var {
        day,
        variant,

        studyId,
        locationRecord,
        teamRecords,
        reservationRecords,
        experimentRecords,
        
        settingRecords,
        settingRelated,

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
    } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();
    var permissions = usePermissions();

    var locationDay = intervalfns.add(
        { start: day.start, end: day.start },
        { start: startTimeInt, end: endTimeInt }
    );

    //var dayIndex = datefns.getISODay(day.start);
    
    var isDayEnabled = checkIsDayEnabled({
        day, showPast, calendarVariant: variant, permissions
    });
    var { _id: locationId } = locationRecord;

    var slotify = useRecordSlotifier({
        locationId,
        start: locationDay.start,
        end: locationDay.end,
        slotDuration
    });
    var slottedReservationRecords = slotify(reservationRecords);
    var slottedExperimentRecords = slotify(experimentRecords)

    var slots = useMemo(() => {
        var tmp = [];
        var visitedExperiments = {};
        for (var it of intervalfns.sliceMillis(locationDay, slotDuration)) {
            var t = it.start.getTime();
        //for (var t = locationDay.start.getTime(); t < locationDay.end.getTime(); t += slotDuration) {

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
        upperBoundary: locationDay.end,

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
        isDayEnabled,
        locale
    }

    return (
        <div>
            { showHeader && (
                <CalendarDayHeader
                    day={ day }
                    extraLabel={ translate('Time') }
                    className={ getHeaderClassName({
                        locationDay, isDayEnabled, testableIntervals
                    })}
                />
            )}
            { slots.map((it) => (
                <TimeSlot
                    key={ it.timestamp }
                    { ...it }
                    { ...sharedSlotProps }
                />
            ))}
        </div>
    )
}

const getHeaderClassName = (bag) => {
    var { locationDay, isDayEnabled, testableIntervals } = bag;
    
    if (!isDayEnabled) {
        return 'text-center text-grey border-bottom bg-light'
    }
    else {
        var isSubjectTestable = false;
        //console.log({ testableIntervals });
        if (testableIntervals) {
            var intersections = intervalfns.intersect(
                [ locationDay ],
                testableIntervals
            );
            //console.log({ intersections });
            isSubjectTestable = intersections.length > 0;
        }

        if (isSubjectTestable) {
            return 'text-center text-success border-bottom bg-light';
        }
        else {
            return 'text-center border-bottom bg-light';
        }
    }
}

const checkIsDayEnabled = (bag) => {
    var { day, showPast, calendarVariant, permissions } = bag;

    // XXX: this had a bug before where 12 hours was added to not the
    // day start but the location day start so im adding 8 hours for now
    var dayNoon = datefns.add(day.start, { hours: 20 }); 
    //var dayNoon = datefns.add(day.start, { hours: 12 }); 
    var enabledSlotTypes = checkShouldEnableCalendarSlotTypes({
        permissions, calendarVariant, refDate: dayNoon
    });

    return showPast || enabledSlotTypes[calendarVariant];
}

export default TimeSlotList;
