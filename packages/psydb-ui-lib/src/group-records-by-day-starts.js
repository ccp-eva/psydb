import { jsonpointer } from '@mpieva/psydb-core-utils';
import datefns from './date-fns';
import getDayStartsInInterval from './get-day-starts-in-interval';

const groupRecordsByDayStarts = (bag) => {
    var { interval, records = [], timestampPointer } = bag;
    var allDayStarts = getDayStartsInInterval(interval);
    
    var groups = {};
    for (var start of allDayStarts) {
        var startT = start.getTime();
        var endT = datefns.endOfDay(start).getTime();

        groups[startT] = records.filter(it => {
            var timestamp = new Date(
                jsonpointer.get(it, timestampPointer)
            ).getTime();

            return (
                timestamp >= startT
                && timestamp <= endT
            )
        })
    }
    return groups;
}

export default groupRecordsByDayStarts;
