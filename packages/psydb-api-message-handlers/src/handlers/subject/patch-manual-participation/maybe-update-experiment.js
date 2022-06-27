'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var maybeUpdateExperiment = async (context) => {
    var { db, cache, dispatch } = context;
    var { originalItem, patchedItem, location, subject } = cache;
    var { experimentId, timestamp } = patchedItem;

    var experiment = await (
        db.collection('experiment').findOne({ _id: experimentId })
    );

    var changedLocation = !compareIds(
        originalItem.locationId, patchedItem.locationId
    );
    var changedTimestamp = (
        originalItem.timestamp.getTime()
        !== patchedItem.timestamp.getTime()
    );
    if (changedLocation || changedTimestamp) {
        var { interval } = experiment.state;
        var duration = interval.end.getTime() - interval.start.getTime();

        await dispatch({
            collection: 'experiment',
            channelId: experimentId,
            payload: { $set: {
                'state.location': location._id,
                'state.locationRecordType': location.type,
                'state.interval': {
                    start: timestamp,
                    end: new Date(timestamp.getTime() + duration)
                }
            }},
        });
    }

    var changedStatus = (
        originalItem.status !== patchedItem.status
    );
    var changedExcludeFromMoreExperimentsInStudy = (
        originalItem.excludeFromMoreExperimentsInStudy
        !== patchedItem.excludeFromMoreExperimentsInStudy
    );
    if (changedStatus || changedExcludeFromMoreExperimentsInStudy) {
        var six = experiment.state.subjectData.findIndex(it => (
            compareIds(it.subjectId, subject._id)
        ));

        var basePath = `state.subjectData.${six}`;
        var participationPath = `${basePath}.participationStatus`;
        var excludePath = `${basePath}.excludeFromMoreExperimentsInStudy`;

        await dispatch({
            collection: 'experiment',
            channelId: experimentId,
            payload: { $set: {
                ...(changedStatus && {
                    [participationPath]: patchedItem.status
                }),
                ...(changedExcludeFromMoreExperimentsInStudy && {
                    [excludePath]: patchedItem.excludeFromMoreExperimentsInStudy
                }),
            }},
        });
    }
}

module.exports = maybeUpdateExperiment;
