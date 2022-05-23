'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var maybeUpdateLocationVisit = async (context) => {
    var { cache, dispatch } = context;
    var { originalItem, patchedItem } = cache;

    var changedTimestamp = (
        originalItem.timestamp.getTime() !== patchedItem.timestamp.getTime()
    );
    var changedLocation = !compareIds(
        originalItem.locationId, patchedItem.locationId
    );

    var { experimentId, timestamp, studyId } = patchedItem;
    if (changedLocation) {
        var experimentType = (
            patchedItem.type === 'manual'
            ? patchedItem.realType
            : patchedItem.type
        );

        // NOTE: we can pull here since we clean up all
        // other participations and change the location id as well
        await dispatch({
            collection: 'location',
            channelId: originalItem.locationId,
            payload: { $pull: {
                'state.internals.visits': { experimentId }
            }},
        });

        await dispatch({
            collection: 'location',
            channelId: patchedItem.locationId,
            payload: { $push: {
                'state.internals.visits': {
                    experimentId,
                    experimentType,
                    timestamp,
                    studyId,
                }
            }},
        });
    }
    else if (!changedLocation && changedTimestamp) {
        var { location } = cache;

        var { visits } = location.state.internals;
        var vix = visits.findIndex(it => (
            compareIds(it.experimentId, experimentId)
        ));
    
        await dispatch({
            collection: 'location',
            channelId: patchedItem.locationId,
            payload: { $set: {
                [`state.internals.visits.${vix}.timestamp`]: timestamp
            }},
        });
    }
}

module.exports = maybeUpdateLocationVisit;
