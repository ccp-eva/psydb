import {
    format,
    add,
    sub,
    set,
    setDay,
    startOfWeek,
    endOfWeek,
    startOfDay,
    endOfDay,
    isSameDay,

    differenceInCalendarYears,
    differenceInCalendarMonths,
    differenceInCalendarDays,

    intervalToDuration,
} from 'date-fns';

import de from 'date-fns/locale/de';

// using subset; adding additional stuff
const custom = {
    add,
    sub,
    set,
    setDay,
    startOfDay,
    endOfDay,
    isSameDay,
    
    differenceInCalendarYears,
    differenceInCalendarMonths,
    differenceInCalendarDays,

    intervalToDuration,
}

custom.format = (date, fmt, options = {}) => (
    format(date, fmt, {
        ...options,
        locale: options.locale || de
    })
);

custom.startOfWeek = (date, options = {}) => (
    startOfWeek(date, {
        ...options,
        locale: options.locale || de
    })
);

custom.endOfWeek = (date, options = {}) => (
    endOfWeek(date, {
        ...options,
        locale: options.locale || de
    })
);


/*custom.startOfUTCDay = (date) => {
    return custom.set(date, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        miliseconds: 0,
    })
};*/

export default custom;
