'use strict';
var { createId } = require('@mpieva/psydb-api-lib');

var executeSystemEvents = async (context) => {
    var { db, cache, personnelId, dispatch, dispatchProps } = context;
    var {
        study, location, file, subjectGroup, labOperators,
        matchedData, preparedObjects
    } = cache.get();

    var now = new Date();
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
        preparedObjects,
    });

    return; ///XXX

    for (var obj of preparedObjects) {
        var { 
            timestamp,
            subjectData,
            experimentName,
            roomOrEnclosure,
            comment,
        } = obj;

        timestamp = convertYMDToDateOnlyServerSide({
            ...timestamp, clientTimezone: timezone
        });

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
                comment,

                invitationStatus: 'scheduled',
                participationStatus: 'participated',
                excludeFromMoreExperimentsInStudy: false,
            })),

            experimentOperatorIds: labOperatorIds,
            subjectGroupId: subjectGroup._id,

            experimentName,
            roomOrEnclosure,
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
