'use strict';
var { createId } = require('@mpieva/psydb-api-lib');

var executeSystemEvents = async (context) => {
    var { db, cache, dispatch, dispatchProps } = context;
    var { study, location, file, matchedData } = cache.get();

    var csvImportId = await createId();
    await db.collection('csvImport').insert({
        _id: csvImportId,
        type: 'experiment/wkprc-evapecognition',
        createdBy: personnelId,
        createdAt: now,
        fileId: file._id,
        locationId: location._id,
        studyId: study._id,
        matchedData,
    });

    for (var it of matchedData) {
        var { subjectId, subjectType, timestamp } = it;

        var experimentId = await createId('experiment');
        var experimentCore = {
            type: 'manual',
            realType: 'apestudies-wkprc-default',
            csvImportId,
        };
       
        var experimentState = {
            seriesId: await createId(),
            isPostprocessed: true,

            studyId: study._id,
            studyRecordType: study.type,

            locationId: location._id,
            locationRecordType: location.type,

            interval: { start: timestamp, end: timestamp },

            selectedSubjectIds: subjectData.map(it => it.subjectId),
            subjectData: subjectData.map(it => ({
                ...it,
                invitationStatus: 'scheduled',
                participationStatus: 'participated',
                comment: '',
                excludeFromMoreExperimentsInStudy: false,
            })),

            experimentOperatorIds: [], // XXX
            subjectGroup: null, // XXX
        }
        
        var participationItem = {
            _id: await createId(),
            experimentId,
            ...experimentCore,

            studyId: study._id,
            studyType: study.type,

            timestamp,
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false
        };

        await dispatchProps({
            collection: 'experiment',
            channelId: experimentId,
            isNew: true,
            additionalChannelProps: experimentCore,
            props: experimentState,

            initialize: true,
            recordType: experimentCore.type,
        });
    }
}

module.exports = { executeSystemEvents }
