import datefns from './date-fns';

// XXX: theese are mpi constants
const DAY = 24*60*60*1000;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

const calculateAge = ({
    base,
    relativeTo
}) => {
    // FIXME: timezone correction
    base = new Date(base);
    relativeTo = new Date(relativeTo);
    
    var tmp = new Date(base);
    var years = datefns.differenceInCalendarYears(relativeTo, tmp);
    tmp = datefns.add(tmp, { years });
    var months = datefns.differenceInCalendarMonths(relativeTo, tmp);
    tmp = datefns.add(tmp, { months });
    var days = datefns.differenceInCalendarDays(relativeTo, tmp);

    /*var delta = relativeTo.getTime() - base.getTime();

    var years = Math.floor(delta / YEAR);
    delta -= years * YEAR;
    var months = Math.floor(delta / MONTH);
    delta -= months * MONTH;
    var days = Math.floor(delta / DAY);*/

    return `${years}/${months}/${days}`;
}

export default calculateAge;
