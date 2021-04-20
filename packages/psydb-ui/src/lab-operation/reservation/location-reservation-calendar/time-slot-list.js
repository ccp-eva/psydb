import React, { useState, useEffect, useReducer, useMemo } from 'react';
import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import slotify from '@mpieva/psydb-common-lib/src/slotify-items';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import TimeSlot from './time-slot';

const TimeSlotList = ({
    studyId,
    teamRecords,
    reservationRecords,
    experimentRecords,
    dayStart,
    startTimeInt,
    endTimeInt,
    slotDuration,
    onSelectEmptySlot,
    onSelectReservationSlot,
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

    return (
        <div>
            <header>
                <div>{ datefns.format(start, 'cccccc dd.MM.') }</div>
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
                        teamRecords={ teamRecords }
                        onSelectEmptySlot={ (props) => onSelectEmptySlot({
                            ...props,
                            maxEnd: end,
                        }) }
                        onSelectReservationSlot={ onSelectReservationSlot }
                    />
                )
            )}
        </div>
    )
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
