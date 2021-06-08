import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from './date-fns';

import withDailyCalendarPages from './with-daily-calendar-pages';
import withWeeklyCalendarPages from './with-weekly-calendar-pages';
import with3DayCalendarPages from './with-3day-calendar-pages';

const withVariableCalendarPages = (Component) => {
    var wrappedVariants = {
        'daily': withDailyCalendarPages(Component),
        'weekly': withWeeklyCalendarPages(Component),
        '3-day': with3DayCalendarPages(Component),
    }

    return (ps) => {
        var WrappedComponent = wrappedVariants[ps.calendarVariant];
        
        return (
            <WrappedComponent { ...ps } />
        )
    }
}

export default withVariableCalendarPages;
