import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from './date-fns';

const withDailyCalendarPages = (Component) => (ps) => {
    
    var [ currentPageStart, setCurrentPageStart ] = (
        useState(datefns.startOfDay(new Date()))
    );

    var handlePageChange = ({ nextIndex, relativeChange }) => {
        var nextDayStart = undefined;
        if (relativeChange === 'next') {
            var eod = datefns.endOfDay(currentPageStart.getTime());
            nextDayStart = (
                new Date(eod.getTime() + 1)
            )
        }
        else {
            nextDayStart = datefns.startOfDay(
                new Date(currentPageStart.getTime() - 1)
            )
        }
        setCurrentPageStart(nextDayStart);
    }

    const currentPageEnd = useMemo(() => (
        datefns.endOfDay(currentPageStart)
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

export default withDailyCalendarPages;
