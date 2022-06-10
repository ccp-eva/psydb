'use strict';
var jsonpointer = require('jsonpointer');
var datefns = require('date-fns');

var { groupBy, entries } = require('@mpieva/psydb-core-utils');

var {
    calculateAge,
    calculateTestableIntervals,
} = require('@mpieva/psydb-common-lib');

var augmentSubjectTestableIntervals = (bag) => {
    var {
        ageFrameFilters,
        subjectRecords,
        desiredTestInterval,
        dobFieldPointer,
    } = bag;

    var ageFrameFiltersForStudy = groupBy({
        items: ageFrameFilters,
        byProp: 'studyId'
    });

    for (var subject of subjectRecords) {
        var dateOfBirth = jsonpointer.get(subject, dobFieldPointer);
        
        //console.log('-------------------------');
        //console.log({ dateOfBirth });
        //console.log({ desiredTestInterval });
        //var startAge = calculateAge({
        //    base: dateOfBirth,
        //    relativeTo: desiredTestInterval.start
        //});
        //var endAge = calculateAge({
        //    base: dateOfBirth,
        //    relativeTo: desiredTestInterval.end
        //});
        //console.log({ startAge, endAge });

        for (var it of entries(ageFrameFiltersForStudy)) {
            var [ studyId, ageFrameFilters ] = it;
            
            var testableIntervals = calculateTestableIntervals({
                desiredTestInterval,
                dateOfBirth,
                ageFrameIntervals: ageFrameFilters.map(it => it.interval)
            });
        
            //console.dir({ testableIntervals }, { depth: null });
            subject[`_testableIntervals_${studyId}`] = testableIntervals;
        }
    }
}

module.exports = augmentSubjectTestableIntervals;
