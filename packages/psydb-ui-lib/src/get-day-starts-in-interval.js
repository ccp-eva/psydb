import datefns from './date-fns';

const getDayStartsInInterval = ({ start, end }) => {
    var startList = [];

    var currentStart = datefns.startOfDay(start);
    while (currentStart.getTime() < end.getTime()) {
        startList.push(currentStart);
        currentStart = (
            // FIXME: start of day is here for safety since im unsure
            // if dst is properly handled in that case in momentjs it
            // doesnt work for adding weeks and above units
            datefns.startOfDay(datefns.add(currentStart, { days: 1 }))
        );
    }
    
    return startList;
}

export default getDayStartsInInterval;
