import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import datefns from './date-fns';

// FIXME: redundant with with-experiment-calendar-days.js
// use the implemntation thats here in this file
const CalendarDayHeader = (ps) => {
    var { day, onClick, extraLabel, children, ...pass } = ps;
    var [{ locale }] = useI18N();
    
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
            { extraLabel }
        </header>
    )
}

export default CalendarDayHeader;
