'use strict';
var { omit, only, compareIds } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');

var onlyRelevant = ({ from }) => only({ from, keys: [
    'date',
    'time',
    'locationId',
    'experimentOperatorIds',
    'subjectData',
]});

var makeExperiment = (bag) => {
    var { pipelineItemGroup, subjectType, study, timezone } = bag
   
    // NOTE: we assume that everything except subjectData s the same
    var [ primaryItem, ...otherItems ] = pipelineItemGroup;
    var {
        date, time, subjectData,
        ...shared
    } = onlyRelevant({ from: primaryItem.obj });
    
    var timestamp = convertYMDHMS({
        date, time, clientTZ: timezone,
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
        realType: 'manual-only-participation',
        csvImportId: null,
    }

    var experimentState = {
        seriesId: ObjectId(),
        isPostprocessed: true,

        selectedSubjectIds: mergedSubjectIds,
        subjectData: mergedSubjectData,

        interval: { start: timestamp, end: timestamp },
        timezone, // FIXME: ????

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

var convertYMDHMS = (bag) => {
    var { date, time, clientTZ } = bag;
    var converted = new Date(`${date}T${time}Z`);
    
    var swapped = swapTimezone({
        date: converted,
        sourceTZ: 'UTC',
        targetTZ: clientTZ,
    });

    return swapped;
}

module.exports = makeExperiment;
