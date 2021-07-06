import React, { useState, useEffect, useReducer, useMemo } from 'react';
import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import slotify from '@mpieva/psydb-common-lib/src/slotify-items';

import datefns from '../../date-fns';

import TimeSlot from './time-slot';

const TimeSlotList = ({
    studyId,
    locationRecord,
    teamRecords,
    reservationRecords,
    experimentRecords,
    dayStart,
    startTimeInt,
    endTimeInt,
    slotDuration,
    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,
}) => {
    const start = new Date(dayStart.getTime() + startTimeInt);
    const end = new Date(dayStart.getTime() + endTimeInt);

    const slottedReservationRecords = useMemo(() => (
        slotifyRecords({
            records: reservationRecords,
            start,
            end,
            slotDuration,
        })
    ), [ reservationRecords ]);

    const slottedExperimentRecords = useMemo(() => (
        slotifyRecords({
            records: experimentRecords,
            start,
            end,
            slotDuration,
        })
    ), [ experimentRecords ]);

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

    var wrappedOnSelectEmptySlot = undefined;
    if (onSelectEmptySlot) {
        wrappedOnSelectEmptySlot = (props) => onSelectEmptySlot({
            ...props,
            maxEnd: getNewReservationMaxEnd({
                start: props.start,
                reservationRecords,
                upperBoundary: end,
                slotDuration,
            }),
        }) 
    }

    var wrappedOnSelectReservationSlot = undefined;
    if (onSelectReservationSlot) {
        wrappedOnSelectReservationSlot = (props) => onSelectReservationSlot({
            ...props,
            maxEnd: getNewExperimentMaxEnd({
                start: props.start,
                selectedReservationRecord: props.reservationRecord,
                reservationRecords,
                upperBoundary: end,
                slotDuration,
            }),
        }) 
    }

    var wrappedOnSelectExperimentSlot = undefined;
    if (onSelectExperimentSlot) {
        wrappedOnSelectExperimentSlot = (props) => onSelectExperimentSlot({
            ...props,
        }) 
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
                    <TimeSlot
                        key={ timestamp }
                        timestamp={ timestamp }
                        reservationRecord={ reservationRecord }
                        experimentRecord={ experimentRecord }

                        slotDuration={ slotDuration }
                        studyId={ studyId }
                        locationRecord={ locationRecord }
                        teamRecords={ teamRecords }
                        onSelectEmptySlot={
                            wrappedOnSelectEmptySlot
                        }
                        onSelectReservationSlot={
                            wrappedOnSelectReservationSlot
                        }
                        onSelectExperimentSlot={
                            wrappedOnSelectExperimentSlot
                        }
                    />
                )
            )}
        </div>
    )
}

const getNewReservationMaxEnd = ({
    start,
    reservationRecords,
    upperBoundary,
    slotDuration,
}) => {
    var found;
    for (var item of reservationRecords) {
        var reservationStart = new Date(item.state.interval.start);
        if (
            reservationStart < upperBoundary
            && start < reservationStart
            && (!found || found > reservationStart)
        ) {
            found = reservationStart;
        }
    }
    console.log(found);
    return new Date((found || upperBoundary).getTime() + slotDuration);
}


const getNewExperimentMaxEnd = ({
    start,
    selectedReservationRecord,
    reservationRecords,
    upperBoundary,
    slotDuration,
}) => {
    var maxEnd = new Date(selectedReservationRecord.state.interval.end);
    
    for (var item of reservationRecords) {
        var reservationStart = new Date(item.state.interval.start);
        var reservationEnd = new Date(item.state.interval.end);
        
        if (
            maxEnd > reservationEnd
            || reservationEnd > upperBoundary
        ) {
            continue;
        }
        
        if (
            item.state.experimentOperatorTeamId
            !== selectedReservationRecord.state.experimentOperatorTeamId
        ) {
            continue;
        }

        // check if continous
        if (maxEnd.getTime() + 1 !== reservationStart.getTime()) {
            continue;
        }

        maxEnd = reservationEnd;
    }

    console.log(maxEnd);

    return new Date(maxEnd.getTime() + slotDuration);
}

const slotifyRecords = ({
    records,
    start,
    end,
    slotDuration,
}) => {
    const all = slotify({
        items: records.map(({ state, ...other }) => ({
            ...other,
            state: { ...state, interval: {
                start: new Date(state.interval.start),
                end: new Date(state.interval.end),
            }}
        })),
        start,
        end,
        slotDuration,
        intervalPointer: '/state/interval'
    });

    // we cant handle multiple items per slot so we use the first one
    const sanitized = all.map(({ timestamp, items }) => ({
        timestamp,
        item: items[0]
    }));

    return keyBy({
        items: sanitized,
        byProp: 'timestamp',
    })
}

export default TimeSlotList;
