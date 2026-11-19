import React from 'react';
import { format } from '@mpieva/psydb-date-interval-fns';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const CalendarItemInterval = (ps) => {
    var { start, end } = ps;
    
    var [{ locale }] = useI18N();
    
    start = new Date(start);
    end = new Date(new Date(end).getTime() + 1); // FIXME: 1ms offset

    var { startTime, endTime } = format(
        { start, end },
        { locale }
    );

    return (
        <b className='d-block'>
            { startTime } - { endTime }
        </b>
    )
}
