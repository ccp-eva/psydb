import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

const TimeSlot = ({
    date,
    slotDuration,
    studyId,
    onSelect,
}) => {
    return (
        <div onClick={ () => onSelect({ date, slotDuration }) }>
            { datefns.format(date, 'p') }
        </div>
    );
}

export default TimeSlot;
