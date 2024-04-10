'use strict';
var { omit } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');

var makeExperiment = (bag) => {
    var {
        preparedObject,
        csvImportId,
        study,
        location,
        labOperators,
        timezone
    } = bag
    
    var { 
        timestamp,
        subjectData,
        experimentName,
        roomOrEnclosure,
        comment,

        subjectGroupId,
    } = preparedObject;

    timestamp = convertYMDToClientNoon({
        ...timestamp, clientTZ: timezone,
    });

    var experimentId = ObjectId();
    var experimentCore = {
        type: 'manual',
        realType: 'apestudies-wkprc-default',
        csvImportId,
    }

    var experimentState = {
        seriesId: ObjectId(),
        isPostprocessed: true,

        studyId: study._id,
        studyRecordType: study.type,

        locationId: location._id,
        locationRecordType: location.type,

        interval: { start: timestamp, end: timestamp },

        selectedSubjectIds: subjectData.map(it => it.subjectId),
        subjectData: subjectData.map(it => ({
            ...omit({ from: it, paths: [ 'role' ]}),
            comment: it.role ? `${it.role}; ${comment}` : comment,

            invitationStatus: 'scheduled',
            participationStatus: 'participated',
            excludeFromMoreExperimentsInStudy: false,
        })),

        experimentOperatorIds: labOperators.map(it => it._id),

        subjectGroupId,
        experimentName,
        roomOrEnclosure,
        timezone,
    }

    return {
        record: {
            _id: experimentId,
            ...experimentCore,
            state: experimentState,
        },
        parts: {
            _id: experimentId,
            core: experimentCore,
            state: experimentState
        }
    }
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

module.exports = makeExperiment;
