'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');

var {
    postprocessSubjectRecords,
    fetchUpcomingExperimentData,
    augmentSubjectTestableIntervals,
} = require('../common-helpers');

var postprocess = async (bag) => {
    var {
        db,
        subjectRecords,

        now,
        interval,
        timezone,
        ageFrameFilters,
       
        studyRecords,

        subjectTypeKey,
        subjectRecordLabelDefinition,
        dobFieldPointer,
    } = bag;
   
    var upcomingSubjectExperimentData = await fetchUpcomingExperimentData({
        db,
        subjectIds: subjectRecords.map(it => it._id),
        after: now,
    });

    var upcomingBySubjectId = keyBy({
        items: upcomingSubjectExperimentData.upcomingForIds,
        byProp: '_id',
    })

    // FIXME: maybe put this into postprocessing
    augmentSubjectTestableIntervals({
        ageFrameFilters,
        subjectRecords,
        desiredTestInterval: interval,
        dobFieldPointer,
        clientTimezone: timezone
    });
    
    postprocessSubjectRecords({
        timezone,
        subjectRecords,
        subjectRecordType: subjectTypeKey,
        studyRecords,
        timeFrame: interval,
        upcomingBySubjectId,
        recordLabelDefinition: subjectRecordLabelDefinition,
    });

    return { upcomingSubjectExperimentData };
}

module.exports = postprocess;
