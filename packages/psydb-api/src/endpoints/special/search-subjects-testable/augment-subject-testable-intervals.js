'use strict';
var jsonpointer = require('jsonpointer');
var datefns = require('date-fns');

var { groupBy, entries } = require('@mpieva/psydb-core-utils');

var {
    calculateAge,
    timeshiftAgeFrame,
    intervalUtils,
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

var calculateTestableIntervals = (bag) => {
    var {
        dateOfBirth,
        ageFrameIntervals,
        desiredTestInterval
    } = bag;

    var allShiftedDoBs = [];
    for (var afi of ageFrameIntervals) {
        var shifted = timeshiftAgeFrame({
            sourceInterval: {
                start: dateOfBirth,
                end: datefns.endOfDay(dateOfBirth)
            },
            ageFrame: afi,
        });
        //console.log({ shifted });
        allShiftedDoBs.push(shifted);
    }

    var merged = intervalUtils.merge({
        intervals: allShiftedDoBs.map(it => ({
            start: it.start.getTime(),
            end: it.end.getTime()
        }))
    });
    //console.log(allShiftedDoBs, desiredTestInterval);

    var intersections = intervalUtils.intersect({
        setA: merged,
        setB: [{
            start: desiredTestInterval.start.getTime(),
            end: desiredTestInterval.end.getTime(),
        }]
    });

    intersections = intersections.map(it => ({
        start: new Date(it.start),
        end: new Date(it.end),
    }));

    return intersections;
}

module.exports = augmentSubjectTestableIntervals;
