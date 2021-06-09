import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from './date-fns';

import withDailyCalendarPages from './with-daily-calendar-pages';
import withWeeklyCalendarPages from './with-weekly-calendar-pages';
import with3DayCalendarPages from './with-3day-calendar-pages';

const withVariableCalendarPages = (Component, options) => {
    var wrappedVariants = {
        'daily': withDailyCalendarPages(Component, options),
        'weekly': withWeeklyCalendarPages(Component, options),
        '3-day': with3DayCalendarPages(Component, options),
    }

    return (ps) => {
        var WrappedComponent = wrappedVariants[ps.calendarVariant];
        
        return (
            <WrappedComponent { ...ps } />
        )
    }
}

export default withVariableCalendarPages;
