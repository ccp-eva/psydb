'use strict';
var { omit, only, compareIds } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');

var makeExperiment = (bag) => {
    var { pipelineItem, subjectType, study, timezone } = bag
    var { date, time, subjectData } = pipelineItem.obj;
    
    var timestamp = convertYMDHMS({
        date, time, clientTZ: timezone,
    });
  
    var selectedSubjectIds = subjectData.map(it => it.subjectId);
    var augmentedSubjectData = subjectData.map(it => ({
        subjectType,
        comment: '', // XXX: forceing default, can ajv do that?
        ...it,

        invitationStatus: 'scheduled',
        participationStatus: 'participated',
        excludeFromMoreExperimentsInStudy: false,
    }))

    var experimentId = ObjectId();
    var experimentCore = {
        type: 'manual',
        realType: 'online-survey',
        csvImportId: null,
    }

    var experimentState = {
        seriesId: ObjectId(),
        isPostprocessed: true,

        selectedSubjectIds,
        subjectData: augmentedSubjectData,

        interval: { start: timestamp, end: timestamp },
        timezone, // FIXME: ????

        studyId: study._id,
        studyRecordType: study.type,
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
