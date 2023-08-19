import React from 'react';

import { useUILocale } from '@mpieva/psydb-ui-contexts';
import datefns from './date-fns';

// FIXME: redundant with with-experiment-calendar-days.js
// use the implemntation thats here in this file
const CalendarDayHeader = (ps) => {
    var { day, onClick, ...pass } = ps;
    var locale = useUILocale();
    
    // FIXME: see https://github.com/date-fns/date-fns/issues/1946
    var label = datefns.format(
        day.start, 'cccccc P',
        { locale }
    ).replace(/\/?\d{4}/, '');
    
    return (
        <header { ...pass }>
            <div role={ onClick ? 'button' : '' } onClick={ onClick }>
                <b>{ label }</b>
            </div>
        </header>
    )
}

export default CalendarDayHeader;
