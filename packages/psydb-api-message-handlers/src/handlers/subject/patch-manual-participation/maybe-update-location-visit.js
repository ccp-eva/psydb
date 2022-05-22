'use strict';

var maybeUpdateLocationVisit = async (context) {
    var { cache, dispatch } = context;
    var { originalItem, patchedItem } = cache;

    var changedTimestamp = (
        originalItem.timestamp.getTime() !== patchedItem.timestamp.getTime()
    );
    var changedLocation = !compareIds(
        originalItem.locationId, patchedItem.locationId
    );

    if (changedLocation) {
        var { experimentId, timestamp, studyId } = patchedItem;
        
        var experimentType = (
            patchedItem.type === 'manual'
            ? patchedItem.realType
            : patchedItem.type
        );

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
    else if (!changedLocationId && changedTimestamp) {
        var { location } = cache;

        var { visits } = location.state.internals;
        var vix = visits.findIndex(it => (
            it.experimentId === experimentId
        ));
    
        await dispatch({
            collection: 'location',
            channelId: patchedItem.locationId,
            payload: { $set: {
                [`state.internals.visits.${vix}`]: {
                    experimentId,
                    experimentType,
                    timestamp,
                    studyId,
                }
            }},
        });
    }
}

module.exports = maybeUpdateLocationVisit;
