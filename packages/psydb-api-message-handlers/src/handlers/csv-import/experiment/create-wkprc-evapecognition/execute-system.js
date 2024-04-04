'use strict';
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');
var { createId } = require('@mpieva/psydb-api-lib');


var executeSystemEvents = async (context) => {
    var {
        db, message, cache, personnelId,
        dispatch, dispatchProps
    } = context;

    var { timezone, payload: { labOperatorIds }} = message;
    var {
        study, location, file, labOperators,
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

    for (var obj of preparedObjects) {
        var { 
            timestamp,
            subjectData,
            experimentName,
            roomOrEnclosure,
            comment,

            subjectGroupId,
        } = obj;

        timestamp = convertYMDToClientNoon({
            ...timestamp, clientTZ: timezone,
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

            subjectGroupId,
            experimentName,
            roomOrEnclosure,
            timezone,
        }
        
        var participationItem = {
            _id: await createId(),
            experimentId,
            ...experimentCore,

            studyId: study._id,
            studyType: study.type,

            timestamp,
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
            timezone,
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

    cache.merge({ csvImportId });
}

var convertYMDToClientNoon = (bag) => {
    var { year, month, day, clientTZ } = bag;
    if (year <= 1894) {
        // FIXME:
        // on 1894-04-01 something wird happened
        // also all dates before 100 AD cannot be timezone corrected properly
        throw new Error('dates in 1894 or earlier cannot be converted')
    }

    var date = new Date();
    date.setUTCHours(12,0,0,0); // NOTE: 12:00 for safety reasons
    date.setUTCFullYear(year);
    date.setUTCMonth(month - 1);
    date.setUTCDate(day);

    var swapped = swapTimezone({
        date,
        sourceTZ: 'UTC',
        targetTZ: clientTZ,
    });

    return swapped;
}

module.exports = { executeSystemEvents }
