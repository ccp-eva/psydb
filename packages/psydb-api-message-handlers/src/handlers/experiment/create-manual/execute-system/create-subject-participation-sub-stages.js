'use strict';
var { only } = require('@mpieva/psydb-core-utils');
var { createId } = require('@mpieva/psydb-api-lib');

var createBaseParticipationItems = async (context, next) => {
    var { message, cache } = context;
    var { experimentId } = cache.get();
    var {
        labMethod,
        subjectData,
        studyId,
        timestamp,
    } = message.payload;

    var participationItems = subjectData.map(it => {
        var {
            subjectId,
            status = 'participated',
            excludeFromMoreExperimentsInStudy = false,
            role = undefined,
        } = it;

        return {
            type: 'manual',
            realType: labMethod,
            studyId,
            studyType: cache.get('study').type,
            timestamp,
            status,
            excludeFromMoreExperimentsInStudy,

            ...(experimentId && { experimentId }),
            ...(role && ({ role })),

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
    var { participationItems } = cache.get();
    
    var pass = only({ from: message.payload, keys: [
        'subjectGroupId', 'experimentName', 'roomOrEnclosure',
        'intradaySeqNumber', 'totalSubjectCount',
    ]})

    participationItems = participationItems.map(it => ({
        ...it, ...pass
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
