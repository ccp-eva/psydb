'use strict';
var { nanoid } = require('nanoid');
var { createId } = require('@mpieva/psydb-api-lib');

var createFakeExperiment = async (context, bag) => {
    var { dispatchProps } = context;
    var {
        labProcedureType,
        timestamp,
        status,

        subject,
        study,
        location,

        experimentOperatorTeam,
        experimentOperatorIds,

        excludeFromMoreExperimentsInStudy,
    } = bag;
    
    if (labProcedureType === 'online-survey') {
        return;
    }

    var experimentId = await createId('experiment');
    var seriesId = nanoid();

    var experimentCore = {
        type: 'manual',
        realType: labProcedureType,
    };

    var experimentState = {
        seriesId,
        isPostprocessed: true,

        studyId: study._id,
        studyRecordType: study.type,
        location: location._id,
        locationRecordType: location.type,
        
        interval: { start: timestamp, end: timestamp },

        selectedSubjectIds: [ subject._id ],
        subjectData: [{
            subjectId: subject._id,
            subjectType: subject.type,
            invitationStatus: "scheduled",
            participationStatus: status,
            comment: "",
            excludeFromMoreExperimentsInStudy,
        }],

        ...(experimentOperatorTeam && {
            experimentOperatorTeamId: experimentOperatorTeam._id
        })
    }

    await dispatchProps({
        collection: 'experiment',
        channelId: experimentId,
        isNew: true,
        additionalChannelProps: experimentCore,
        props: experimentState,

        initialize: true,
        recordType: experimentCore.type,
    });

    return experimentId;
}

module.exports = createFakeExperiment;
