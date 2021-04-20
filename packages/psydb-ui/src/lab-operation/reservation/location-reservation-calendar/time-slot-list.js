import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import TimeSlot from './time-slot';

const TimeSlotList = ({
    studyId,
    dayStart,
    startTimeInt,
    endTimeInt,
    slotDuration,
    onSelectSlot,
}) => {
    var start = new Date(dayStart.getTime() + startTimeInt);
    var end = new Date(dayStart.getTime() + endTimeInt);

    var slots = [];
    for (var t = start.getTime(); t < end.getTime(); t += slotDuration) {
        slots.push(new Date(t));
    }

    return (
        <div>
            <header>
                <div>{ datefns.format(start, 'cccccc dd.MM.') }</div>
                <div>Uhrzeit</div>
            </header>
            { slots.map((date) => (
                <TimeSlot
                    key={ date.getTime() }
                    date={ date }
                    slotDuration={ slotDuration }
                    studyId={ studyId }
                    onSelect={ (props) => onSelectSlot({
                        ...props,
                        maxEnd: end,
                    }) }
                />
            ))}
        </div>
    )
}

export default TimeSlotList;
