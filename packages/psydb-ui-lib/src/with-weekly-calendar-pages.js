import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from './date-fns';

import { useURLSearchParams } from '@cdxoo/react-router-url-search-params';

const withWeeklyCalendarPages = (
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

        currentPageStart = datefns.startOfWeek(currentPageStart);

        var setCurrentPageStart = (next) => {
            updateQuery({
                ...query,
                d: next.getTime()
            })
        }
    }
    else {
        var [ currentPageStart, setCurrentPageStart ] = (
            useState(datefns.startOfWeek(new Date()))
        );
    }

    var handlePageChange = ({ nextIndex, relativeChange }) => {
        var nextWeekStart = undefined;
        if (relativeChange === 'next') {
            var eow = datefns.endOfWeek(currentPageStart.getTime());
            nextWeekStart = (
                new Date(eow.getTime() + 1)
            )
        }
        else {
            nextWeekStart = datefns.startOfWeek(
                new Date(currentPageStart.getTime() - 1)
            )
        }
        setCurrentPageStart(nextWeekStart);
    }

    const currentPageEnd = useMemo(() => (
        datefns.endOfWeek(currentPageStart)
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

export default withWeeklyCalendarPages;
