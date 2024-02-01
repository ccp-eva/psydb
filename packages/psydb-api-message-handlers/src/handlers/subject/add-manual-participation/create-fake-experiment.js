'use strict';
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
    
    var experimentId = await createId('experiment');
    var seriesId = await createId();

    var experimentCore = {
        type: 'manual',
        realType: labProcedureType,
    };

    var experimentState = {
        seriesId,
        isPostprocessed: true,

        studyId: study._id,
        studyRecordType: study.type,

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

        ...(location && {
            locationId: location._id,
            locationRecordType: location.type,
        }),
        
        ...(experimentOperatorTeam && {
            experimentOperatorTeamId: experimentOperatorTeam._id,
            experimentOperatorIds: experimentOperatorTeam.state.personnelIds,
        }),
        ...(experimentOperatorIds && {
            experimentOperatorIds,
        }),
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
