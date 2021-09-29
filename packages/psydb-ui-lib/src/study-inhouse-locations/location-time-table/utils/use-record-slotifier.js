import { useMemo, useCallback } from 'react';

import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import slotify from '@mpieva/psydb-common-lib/src/slotify-items';

const slotifyRecords = ({
    records,
    start,
    end,
    slotDuration,
}) => {
    const all = slotify({
        items: records.map(({ state, ...other }) => ({
            ...other,
            state: { ...state, interval: {
                start: new Date(state.interval.start),
                end: new Date(state.interval.end),
            }}
        })),
        start,
        end,
        slotDuration,
        intervalPointer: '/state/interval'
    });

    // we cant handle multiple items per slot so we use the first one
    const sanitized = all.map(({ timestamp, items }) => ({
        timestamp,
        item: items[0]
    }));

    return keyBy({
        items: sanitized,
        byProp: 'timestamp',
    })
}

var useRecordSlotifier = ({
    locationId,
    start,
    end,
    slotDuration
}) => {
    var updateChecks = [
        locationId,
        start.getTime(),
        end.getTime(),
        slotDuration
    ];
    
    var callback = useCallback((records) => {
        var slotted = useMemo(() => (
            slotifyRecords({
                records: records.filter(it => (
                    it.state.locationId === locationId
                )),
                start,
                end,
                slotDuration,
            })
        ), [ ...updateChecks, records, locationId ]);
        // FIXME: not sure if updateCheks is needed twice
        
        return slotted;
    }, updateChecks);
    
    return callback;
}

export default useRecordSlotifier;
