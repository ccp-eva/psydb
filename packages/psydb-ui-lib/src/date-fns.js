import {
    format,
    set,
    setDay,
    startOfWeek,
    startOfDay,
} from 'date-fns';

import de from 'date-fns/locale/de';

// using subset; adding additional stuff
const custom = {
    set,
    setDay,
    startOfWeek,
    startOfDay,
}

custom.format = (date, fmt, options = {}) => (
    format(date, fmt, {
        ...options,
        locale: options.locale || de
    })
);

custom.startOfUTCDay = (date) => {
    return custom.set(date, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        miliseconds: 0,
    })
};

export default custom;
