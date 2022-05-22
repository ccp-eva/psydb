'use strict';
var { nanoid } = require('nanoid');

var createParticipation = async (context, bag) => {
    var { dispatch } = context;
    var {
        experimentId,
        labProcedureType,
        timestamp,
        status,

        subject,
        study,
        location,

        experimentOperatorTeam,
        experimentOperatorIds,
    } = bag;

    var participationItem = {
        _id: nanoid(),

        type: 'manual',
        realType: labProcedureType,

        studyId: study._id,
        studyType: study.type,

        timestamp,
        status,

        ...(experimentId && {
            experimentId
        }),

        // TODO
        excludeFromMoreExperimentsInStudy: false
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

    await dispatch({
        collection: 'subject',
        channelId: subject._id,
        subChannelKey: 'scientific',
        payload: { $push: {
            'scientific.state.internals.participatedInStudies': (
                participationItem
            ),
        }}
    });
}

module.exports = createParticipation;
