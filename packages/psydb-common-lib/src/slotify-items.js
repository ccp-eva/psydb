const jsonpointer = require('jsonpointer');
//import quicksort from '@mpieva/psydb-common-lib/src/quicksort';

const slotify = ({
    items,
    slotDuration,

    start: slotifyStart,
    end: slotifyEnd,

    intervalPointer = '',
    presorted = false,
}) => {
    var compiledPointer = jsonpointer.compile(intervalPointer);

    // TODO: optimization
    /*if (!presorted) {
        // quicksort changes the underlying array
        items = [ ...items ]
        quicksort(items, (a, b) => {
            var aInterval = compiledPointer.get(a);
            var bInterval = compiledPointer.get(b);
            return a.start.getTime() - b.start.getTime();
        })
    }*/

    /*var first = items[0],
        last = items[items.length - 1];

    var firstStart = compiledPointer(first).start.getTime(),
        lastEnd = compoledPointer(last).end.getTime();*/

    slotifyStart = slotifyStart.getTime();
    slotifyEnd = slotifyEnd.getTime();

    var slotified = [];
    for (var t = slotifyStart; t < slotifyEnd; t += slotDuration) {
        var matching = items.filter(it => {
            return checkInsideInterval({
                value: t,
                interval: convertIntervalToInt(compiledPointer.get(it))
            });
        });

        slotified.push({
            timestamp: t,
            items: matching
        })
    }

    return slotified;
}

const convertIntervalToInt = (interval) => ({
    start: interval.start.getTime(),
    end: interval.end.getTime(),
});

// this checks half open intervalbounds
// i.e. [0, 1) where 0 is inside but 1 isnt
const checkInsideInterval = ({
    value,
    interval
}) => (
    interval.start <= value
    && interval.end > value
)

module.exports = slotify;
