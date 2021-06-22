import datefns from './date-fns';

const formatInterval = (interval) => {
    var { start, end } = interval;
    start = new Date(start);
    end = new Date(end);

    // accomodate for .999Z since interval is half open [s, e)
    end = new Date(end.getTime() + 1);

    return {
        startDate: datefns.format(start, 'P'),
        startTime: datefns.format(start, 'p'),
        endDate: datefns.format(end, 'P'),
        endTime: datefns.format(end, 'p'),
    }
}

export default formatInterval;
