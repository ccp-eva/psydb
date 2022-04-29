import datefns from './date-fns';

const formatInterval = (interval) => {
    var { start, end } = interval;
    if (start !== undefined) {
        start = new Date(start);
    }
    if (end !== undefined) {
        end = new Date(end);
        // accomodate for .999Z since interval is half open [s, e)
        end = new Date(end.getTime() + 1);
    }


    return {
        ...(start !== undefined && {
            startDate: datefns.format(start, 'dd.MM.yyyy'),
            startTime: datefns.format(start, 'HH:mm'),
        }),
        ...(end !== undefined && {
            endDate: datefns.format(end, 'dd.MM.yyyy'),
            endTime: datefns.format(end, 'HH:mm'),
        })
    }
}

export default formatInterval;
