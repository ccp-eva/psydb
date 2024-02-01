'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var maybeUpdateExperiment = async (context) => {
    var { db, cache, message, dispatch } = context;
    var {
        originalItem, patchedItem,
        location, subject,
        experimentOperatorTeam,
    } = cache;
    var { experimentId, timestamp } = patchedItem;

    var experiment = await (
        db.collection('experiment').findOne({ _id: experimentId })
    );

    var { interval } = experiment.state;
    var duration = interval.end.getTime() - interval.start.getTime();

    var six = experiment.state.subjectData.findIndex(it => (
        compareIds(it.subjectId, subject._id)
    ));

    var basePath = `state.subjectData.${six}`;
    var participationPath = `${basePath}.participationStatus`;
    var excludePath = `${basePath}.excludeFromMoreExperimentsInStudy`;

    var {
        status,
        experimentOperatorIds,
        excludeFromMoreExperimentsInStudy,
    } = patchedItem

    await dispatch({
        collection: 'experiment',
        channelId: experimentId,
        payload: { $set: {
            'state.interval': {
                start: timestamp,
                end: new Date(timestamp.getTime() + duration)
            },
            
            [participationPath]: status,
            [excludePath]: excludeFromMoreExperimentsInStudy,

            ...(location && {
                'state.locationId': location._id,
                'state.locationRecordType': location.type,
            }),
            ...(experimentOperatorTeam && {
                'state.experimentOperatorTeamId': experimentOperatorTeam._id,
                'state.experimentOperatorIds': (
                    experimentOperatorTeam.state.personnelIds
                ),
            }),
            ...(experimentOperatorIds && {
                'state.experimentOperatorIds': experimentOperatorIds
            }),
        }},
    });
}

module.exports = maybeUpdateExperiment;
