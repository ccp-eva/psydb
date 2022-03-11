import datefns from './date-fns';

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
