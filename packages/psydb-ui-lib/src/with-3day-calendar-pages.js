import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from './date-fns';

import { useURLSearchParams } from '@mpieva/psydb-ui-hooks';

const with3DayCalendarPages = (
    Component,
    { withURLSearchParams } = {}
) => (ps) => {
   
    if (withURLSearchParams) {
        var [ query, updateQuery ] = useURLSearchParams();
        
        var currentPageStart = (
            query.d
            ? new Date(parseInt(query.d))
            : new Date()
        );

        currentPageStart = datefns.startOfDay(currentPageStart);

        var setCurrentPageStart = (next) => {
            updateQuery({
                ...query,
                d: next.getTime()
            })
        }
    }
    else {
        var [ currentPageStart, setCurrentPageStart ] = (
            useState(datefns.startOfDay(new Date()))
        );
    }

    var handlePageChange = ({ nextIndex, relativeChange }) => {
        var nextDayStart = undefined;
        if (relativeChange === 'next') {
            var eod = datefns.add(currentPageStart.getTime(), { days: 3 });
            nextDayStart = (
                new Date(eod.getTime())
            )
        }
        else {
            nextDayStart = datefns.sub(
                currentPageStart.getTime(), { days: 3 }
            )
        }
        setCurrentPageStart(nextDayStart);
    }

    const currentPageEnd = useMemo(() => (
        new Date(datefns.add(currentPageStart, { days: 3 }).getTime() - 1)
    ), [ currentPageStart ]);

    return (
        <Component { ...({
            ...ps,
            currentPageStart,
            currentPageEnd,
            onPageChange: handlePageChange,
        })} />
    )
}

export default with3DayCalendarPages;
