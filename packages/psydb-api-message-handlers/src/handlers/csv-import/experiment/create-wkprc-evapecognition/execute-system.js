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
        pipelineOutput
    } = cache.get();

    var { matchedData, preparedObjects, transformed } = pipelineOutput;
    var { experiments, participations } = transformed;

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

    for (var it of experiments) {
        var { parts } = it;
        await dispatchProps({
            collection: 'experiment',
            channelId: parts._id,
            isNew: true,
            additionalChannelProps: { ...parts.core, csvImportId },
            props: parts.state,

            initialize: true,
            recordType: parts.core.type,
        });
    }

    for (var it of participations) {
        var [ subjectId, data ] = it;
        console.log({ subjectId, data });
        await dispatch({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            payload: { $push: {
                'scientific.state.internals.participatedInStudies': {
                    ...data, csvImportId
                },
            }}
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
