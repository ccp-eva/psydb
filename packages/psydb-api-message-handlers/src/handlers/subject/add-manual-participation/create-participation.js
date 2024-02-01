'use strict';
var { createId } = require('@mpieva/psydb-api-lib');

var createParticipation = async (context, bag) => {
    var { dispatch } = context;
    var {
        experimentId,
        labProcedureType,
        timestamp,
        status,

        subjects,
        study,
        location,

        experimentOperatorTeam,
        experimentOperatorIds,
        excludeFromMoreExperimentsInStudy,
    } = bag;

    var participationItem = {
        _id: await createId(),

        type: 'manual',
        realType: labProcedureType,

        studyId: study._id,
        studyType: study.type,

        timestamp,
        status,

        ...(experimentId && {
            experimentId
        }),

        excludeFromMoreExperimentsInStudy
    }

    if (labProcedureType !== 'online-survey') {
        participationItem = {
            ...participationItem,
            locationId: location._id,
            locationType: location.type,
        }

        if (experimentOperatorTeam) {
            var { personnelIds } = experimentOperatorTeam.state;
            participationItem.experimentOperatorIds = personnelIds;
        }
        else {
            participationItem.experimentOperatorIds = experimentOperatorIds;
        }
    }

    if (labProcedureType === 'apestudies-wkprc-default') {
        var {
            // apestudies
            studyTopics,
            experimentName,
        } = bag;
        
        participationItem = {
            ...participationItem,
            studyTopicIds: studyTopics.map(it => it._id),
            experimentName
        };
    }

    for (var it of subjects) {
        await dispatch({
            collection: 'subject',
            channelId: it._id,
            subChannelKey: 'scientific',
            payload: { $push: {
                'scientific.state.internals.participatedInStudies': {
                    _id: await createId(),
                    ...participationItem,
                },
            }}
        });
    }
}

module.exports = createParticipation;
