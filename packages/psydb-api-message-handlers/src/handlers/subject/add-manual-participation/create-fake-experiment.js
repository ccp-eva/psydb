'use strict';
var { createId } = require('@mpieva/psydb-api-lib');

var createFakeExperiment = async (context, bag) => {
    var { dispatchProps } = context;
    var {
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

        selectedSubjectIds: subjects.map(it => it._id),
        subjectData: subjects.map(it => ({
            subjectId: it._id,
            subjectType: it.type,
            invitationStatus: "scheduled",
            participationStatus: status,
            comment: "",
            excludeFromMoreExperimentsInStudy,
        })),

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

    if (labProcedureType === 'apestudies-wkprc-default') {
        var {
            // apestudies
            studyTopics,
            experimentName,
        } = bag;

        experimentState = {
            ...experimentState,
            studyTopicIds: studyTopics.map(it => it._id),
            experimentName
        };
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
