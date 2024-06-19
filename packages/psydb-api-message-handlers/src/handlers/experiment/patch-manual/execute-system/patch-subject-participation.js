'use strict';
var sift = require('sift');

var { only, keyBy, entries, pathify } = require('@mpieva/psydb-core-utils');
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');
var { createId } = require('@mpieva/psydb-api-lib');


var compose_patchSubjectParticipation = () => compose([
    setupParticipationBaseUpdates,

    switchComposition({
        // XXX does cache work with switchComposition?
        // => no; see ticket
        by: '/cache/_internal/labMethod',
        branches: {
            'inhouse': [
                addLocationAndOperators,
            ],
            'online-video-call': [
                addLocationAndOperators,
            ],
            'away-team': [
                addOperators,
            ],
            'apestudies-wkprc-default': [
                addLocationAndOperators,
                addApestudiesWKPRCDefaultExtraData,
            ],
            'manual-only-participation': [
                addLocationAndOperators,
            ],
            'online-survey': [],
        },
    }),

    dispatchUpdates
])

var setupParticipationBaseUpdates = async (context, next) => {
    var { message, cache } = context;
    var { experimentId } = message.payload;
    var { experiment } = cache.get();
    
    var { type, realType, state: {
        studyId,
        studyRecordType,
        subjectData: originalSubjectData,
    }} = experiment;

    var {
        subjectData,
        interval,
        timestamp,
    } = message.payload;

    var originalSubjectDataById = keyBy({
        items: originalSubjectData,
        byProp: 'subjectId'
    });

    var participationCreateUpdates = [];
    var participationPatchUpdates = [];

    for (var it of subjectData) {
        var {
            subjectId,
            status = 'participated',
            excludeFromMoreExperimentsInStudy = false,
            role = undefined, // FIXME apestudies
            comment,
        } = it;
        
        var original = originalSubjectDataById[subjectId];

        var shared = {
            timestamp: interval ? interval.start : timestamp,
            status,
            excludeFromMoreExperimentsInStudy,
            experimentId,
            subjectId,
            ...(role !== undefined && { role }), // FIXME: apestudies
            ...(comment !== undefined && { comment }),
        }

        if (original) {
            participationPatchUpdates.push(shared);
        }
        else {
            participationCreateUpdates.push({
                type,
                realType,
                studyId,
                studyType: studyRecordType,

                ...shared
            });
        }
    };

    var participationRemoveUpdates = [];

    var newSubjectDataById = keyBy({
        items: subjectData,
        byProp: 'subjectId'
    });
    for (var it of originalSubjectData) {
        var { subjectId } = it;
        if (!newSubjectDataById[subjectId]) {
            participationRemoveUpdates.push({
                experimentId,
                subjectId,
            });
        }
    }

    cache.merge({
        participationCreateUpdates,
        participationPatchUpdates,
        participationRemoveUpdates,
    });
    await next();
}

var addLocationAndOperators = async (context, next) => {
    var { message, cache } = context;
    var { locationId, labOperatorIds } = message.payload;
    var {
        participationCreateUpdates,
        participationPatchUpdates,
        location
    } = cache.get();

    var mapped = mapAll({
        lists: {
            participationCreateUpdates,
            participationPatchUpdates,
        },
        lambda: (it) => ({
            ...it,
            locationId,
            locationType: location.type,
            experimentOperatorIds: labOperatorIds
        })
    });

    cache.merge({ ...mapped });
    await next();
}

var addOperators = async (context, next) => {
    var { message, cache } = context;
    var { labOperatorIds } = message.payload;
    var {
        participationCreateUpdates,
        participationPatchUpdates,
    } = cache.get();

    var mapped = mapAll({
        lists: {
            participationCreateUpdates,
            participationPatchUpdates,
        },
        lambda: (it) => ({
            ...it,
            experimentOperatorIds: labOperatorIds
        })
    });

    cache.merge({ ...mapped });
    await next();
}

var addApestudiesWKPRCDefaultExtraData = async (context, next) => {
    var { message, cache } = context;
    
    var {
        participationCreateUpdates,
        participationPatchUpdates,
    } = cache.get();

    var pass = only({ from: message.payload, keys: [
        'subjectGroupId', 'experimentName', 'roomOrEnclosure',
        'intradaySeqNumber', 'totalSubjectCount',
    ]})

    var mapped = mapAll({
        lists: {
            participationCreateUpdates,
            participationPatchUpdates,
        },
        lambda: (it) => ({
            ...it, ...pass
        })
    });

    cache.merge({ ...mapped });
    await next();
}

var dispatchUpdates = async (context, next) => {
    var { cache, dispatch } = context;
    var {
        subjects,
        participationCreateUpdates,
        participationPatchUpdates,
        participationRemoveUpdates,
    } = cache.get();

    var subjectDispatch = async ({ subjectId, payload }) => (
        await dispatch({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            payload: payload
        })
    );
    
    var basepath = 'scientific.state.internals.participatedInStudies';

    for (var it of participationCreateUpdates) {
        var { subjectId, ...participation } = it;
        await subjectDispatch({
            subjectId,
            payload: { $push: {
                [basepath]: {
                    _id: await createId(),
                    ...participation,
                },
            }}
        });
    }

    var subjectsById = keyBy({
        items: subjects,
        byProp: '_id',
    });
    for (var it of participationPatchUpdates) {
        var { subjectId, experimentId, ...participation } = it;

        var subject = subjectsById[subjectId];
        var { participatedInStudies } = subject.scientific.state.internals;
        var pix = participatedInStudies.findIndex(sift({ experimentId }));
        
        var prefix = `${basepath}.${pix}`;
        await subjectDispatch({
            subjectId,
            payload: { $set: {
                ...pathify(participation, { prefix })
            }}
        });
    }

    for (var it of participationRemoveUpdates) {
        var { subjectId, experimentId } = it;
        await subjectDispatch({
            subjectId,
            payload: { $pull: {
                [basepath]: { experimentId },
            }}
        });
    }

    await next();
}

var mapAll = ({ lists, lambda }) => {
    var out = {};
    for (var [ key, items ] of entries(lists)) {
        out[key] = items.map(lambda)
    }
    return out;
}

module.exports = compose_patchSubjectParticipation();
