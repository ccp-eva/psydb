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

export const createAgeFrameKey = ({ studyId, interval }) => {
    var create = (af) => {
        var { years, months, days } = af;
        return `${years}-${months}-${days}`;
    }

    var start = create(interval.start);
    var end = create(interval.end);

    return `${studyId}/${start}_${end}`;
}

export const escapeJsonPointer = (pointer) => (
    pointer.replaceAll(/\//g, '~1')
);

export const unescapeJsonPointer = (pointer) => (
    pointer.replaceAll('~1', '/')
);

export const createInitialValues = ({
    ageFrameRecords
}) => {
    var now = new Date();
    var initialValues = {
        interval: {
            start: now.toISOString(),
            end: now.toISOString()
        },
        filters: {}
    };
    for (var ageFrame of ageFrameRecords) {
        var { studyId, state } = ageFrame;
        var { interval, conditions } = state;
        var afKey = createAgeFrameKey({ studyId, interval });
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
