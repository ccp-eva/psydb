'use strict';
var { createId } = require('@mpieva/psydb-api-lib');

var createBaseParticipationItems = async (context, next) => {
    var { message, cache } = context;
    var { experimentIdsBySubject, study } = cache.get();
    var {
        labMethod,
        subjectData,
        studyId,
    } = message.payload;

    var participationItems = subjectData.map(it => {
        var {
            subjectId,
            timestamp,
            status,
            excludeFromMoreExperimentsInStudy
        } = it;

        return {
            type: 'manual',
            realType: labMethod,
            studyId,
            studyType: study.type,
            timestamp,
            status,
            excludeFromMoreExperimentsInStudy,
            ...(experimentIdsBySubject && {
                experimentId: experimentIdsBySubject[subjectId]
            }),

            subjectId,
        }
    });

    cache.merge({ participationItems });
    await next();
}

var addLocationAndOperators = async (context, next) => {
    var { message, cache } = context;
    var { locationId, labOperatorIds } = message.payload;
    var { participationItems, location, labTeam } = cache.get();

    participationItems = participationItems.map(it => ({
        ...it,
        locationId,
        locationType: location.type,
        experimentOperatorIds: (
            labTeam
            ? labTeam.state.personnelIds
            : labOperatorIds
        )
    }))

    cache.merge({ participationItems });
    await next();
}

var addApestudiesWKPRCDefaultExtraData = async (context, next) => {
    var { message, cache } = context;
    var {
        subjectGroupId,
        experimentName,
        roomOrEnclosure,
    } = message.payload;
    var { participationItems } = cache.get();

    participationItems = participationItems.map(it => ({
        ...it,
        subjectGroupId,
        experimentName,
        roomOrEnclosure,
    }))

    cache.merge({ participationItems });
    await next();
}

var dispatchUpdates = async (context, next) => {
    var { cache, dispatch } = context;
    var { participationItems } = cache.get();

    for (var it of participationItems) {
        var { subjectId, ...participation } = it;
        await dispatch({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            payload: { $push: {
                'scientific.state.internals.participatedInStudies': {
                    _id: await createId(),
                    ...participation,
                },
            }}
        });
    }

    await next();
}

module.exports = {
    createBaseParticipationItems,
    addLocationAndOperators,
    addApestudiesWKPRCDefaultExtraData,
    dispatchUpdates
}
