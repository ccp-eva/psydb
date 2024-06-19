'use strict';
var { omit, only, compareIds } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');

var onlyRelevant = ({ from }) => only({ from, keys: [
    'experimentName',
    'intradaySeqNumber',
    'year',
    'month',
    'day',
    'locationId',
    'roomOrEnclosure',
    'experimentOperatorIds',
    'subjectData',
    'totalSubjectCount',
    'subjectGroupId',
]});

var makeExperiment = (bag) => {
    var {
        pipelineItemGroup,
        subjectType,
        study,
        //location,
        //labOperators,
        timezone
    } = bag
   

    // NOTE: we assume that everything except subjectData s the same
    var [ primaryItem, ...otherItems ] = pipelineItemGroup;
    var {
        year, month, day, subjectData,
        ...shared
    } = onlyRelevant({ from: primaryItem.obj });
    
    var timestamp = convertYMDToClientNoon({
        year, month, day, clientTZ: timezone,
    });

    var { locationId } = shared;
    var { type: locationRecordType } = primaryItem.replacements.find(it => (
        compareIds(it._id, locationId)
    ));

   
    var mergedSubjectIds = [];
    var mergedSubjectData = []
    for (var it of [ primaryItem, ...otherItems ]) {
        var { obj } = it;
        for (var it of obj.subjectData) {
            mergedSubjectIds.push(it.subjectId)
            mergedSubjectData.push({
                subjectType,
                comment: '', // XXX: forceing default, can ajv do that?
                ...it,

                invitationStatus: 'scheduled',
                participationStatus: 'participated',
                excludeFromMoreExperimentsInStudy: false,
            })
        }
    }

    var experimentId = ObjectId();
    var experimentCore = {
        type: 'manual',
        realType: 'apestudies-wkprc-default',
        csvImportId: null,
    }

    var experimentState = {
        seriesId: ObjectId(),
        isPostprocessed: true,

        selectedSubjectIds: mergedSubjectIds,
        subjectData: mergedSubjectData,

        interval: { start: timestamp, end: timestamp },

        studyId: study._id,
        studyRecordType: study.type,
        ...shared,
        locationRecordType,
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
