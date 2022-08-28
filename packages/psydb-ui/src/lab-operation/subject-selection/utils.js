import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import intervalfns from '@mpieva/psydb-date-interval-fns';

export const parseEncodedInterval = (str) => {
    var parseEdge = (s) => {
        var [ years, months, days ] = s.split('-');
        return { years, months, days };
    }

    var [ start, end ] = str.split('_');
    return {
        start: parseEdge(start),
        end: parseEdge(end)
    }
}

export const createAgeFrameKey = (ageFrameRecord) => {
    var { _id, studyId, state } = ageFrameRecord;
    return `${studyId}/${_id}`;
}

export const escapeJsonPointer = (pointer) => (
    pointer.replaceAll(/\//g, '~1')
);

export const unescapeJsonPointer = (pointer) => (
    pointer.replaceAll('~1', '/')
);

export const createInitialValues = ({
    ageFrameRecords,
    locale
}) => {
    var now = new Date();
    //var interval = intervalfns.weekIntervalOf(now, { locale });
    //interval = intervalfns.add(interval, { both: { weeks: 1 }});
    var interval = { start: now, end: datefns.endOfWeek(now, { locale }) };
    interval = intervalfns.add(interval, { both: { days: 1 }});
    interval = intervalfns.add(interval, { end: { weeks: 1 }});

    var initialValues = {
        interval: intervalfns.dtos(interval),
        filters: {}
    };
    for (var ageFrame of ageFrameRecords) {
        var { studyId, state } = ageFrame;
        var { interval, conditions } = state;
        var afKey = createAgeFrameKey(ageFrame);
        initialValues.filters[afKey] = true;

        for (var cond of conditions) {
            var { pointer, values } = cond;
            var condKey = escapeJsonPointer(pointer);
            
            for (var value of values) {
                // FIXME: maybe escape certain values?
                var fullKey = `${afKey}/${condKey}/${value}`;
                initialValues.filters[fullKey] = true;
            }
        }
    }
    return initialValues;
}
