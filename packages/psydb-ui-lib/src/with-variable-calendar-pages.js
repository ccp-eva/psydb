import React, { useState, useEffect, useReducer, useMemo } from 'react';
import datefns from './date-fns';

import withDailyCalendarPages from './with-daily-calendar-pages';
import withWeeklyCalendarPages from './with-weekly-calendar-pages';

const withVariableCalendarPages = (Component) => {
    var wrappedVariants = {
        'daily': withDailyCalendarPages(Component),
        'weekly': withWeeklyCalendarPages(Component),
    }

    return (ps) => {
        var WrappedComponent = wrappedVariants[ps.calendarVariant];
        
        return (
            <WrappedComponent { ...ps } />
        )
    }
}

export default withVariableCalendarPages;
