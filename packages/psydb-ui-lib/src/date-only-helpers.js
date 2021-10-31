import { swapTimezone } from '@mpieva/psydb-timezone-helpers';

export const splitISO = (value) => {
    var date, time, fraction;
    if (typeof value === 'string') {
        var match = value.match(/^(.*)T(\d\d:\d\d:\d\d)\.(\d{3})Z$/);
        if (match) {
            ([ date, time, fraction ] = match.slice(1))
        }
    }

    return { date, time, fraction };
}

export const checkDate = (date) => {
    if (isNaN(date.getTime())) {
        return false;
    }
    return true;
}

export const canSwap = (date) => {
    // offset is weird before 1894-03-31
    // also we cannot swap timezones for dates before 100 AD
    if (date.getUTCFullYear() <= 1894) {
        return false
    }
    return true;
}

export const createInitialDate = ({
    value,
    serverTimezone,
    clientTimezone,
    isInitialValueSwapped
}) => {
    var temp = new Date(value);
    if (!checkDate(temp)) {
        return '';
    }
    
    if (!canSwap(temp)) {
        return '';
    }

    if (isInitialValueSwapped) {
        var swapped = swapTimezone({
            date: temp,
            sourceTZ: serverTimezone,
            targetTZ: clientTimezone
        });
        //console.log({ temp, swapped })
        var { date } = splitISO(swapped.toISOString());
        return date;
    }
    else {
        var { date } = splitISO(value);
        return date;
    }
}

export const canParseBack = (value) => {
    var date = new Date(value);
    return (
        /^\d{4}-\d{2}-\d{2}$/.test(value)
        && checkDate(date)
        && canSwap(date)
    )
}

export const parseBack = (value) => {
    var [ y,m,d ] = value.split(/-/);
    var date = new Date();
    date.setHours(0,0,0,0);
    date.setFullYear(parseInt(y));
    date.setMonth(parseInt(m) - 1);
    date.setDate(parseInt(d));

    return date;
}
