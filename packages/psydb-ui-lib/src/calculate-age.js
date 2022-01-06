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

    var { years, months, days } = datefns.intervalToDuration({
        start: base, end: relativeTo
    });
    
    return `${years}/${months}/${days}`;
}

export default calculateAge;
