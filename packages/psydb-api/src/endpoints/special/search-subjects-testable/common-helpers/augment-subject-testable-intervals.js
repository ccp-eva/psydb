'use strict';
var jsonpointer = require('jsonpointer');
var datefns = require('date-fns');
var { getSystemTimezone } = require('@mpieva/psydb-timezone-helpers');

var { groupBy, entries } = require('@mpieva/psydb-core-utils');

var {
    calculateAge,
    calculateTestableIntervals,
} = require('@mpieva/psydb-common-lib');



var {
    zonedTimeToUtc,
    utcToZonedTime
} = require('date-fns-tz');
// FIXME: redundant
var convertIntervalTZ = (interval, options = {}) => {
    var { sourceTZ, targetTZ } = options;
    var { start, end } = interval;

    if (sourceTZ) {
        start = zonedTimeToUtc(start, sourceTZ);
        end = zonedTimeToUtc(end, sourceTZ);
    }
    if (targetTZ) {
        start = utcToZonedTime(start, targetTZ);
        end = utcToZonedTime(end, targetTZ);
    }

    return { start, end };
}



var augmentSubjectTestableIntervals = (bag) => {
    var {
        ageFrameFilters,
        subjectRecords,
        desiredTestInterval,
        //dobFieldPointer,
        clientTimezone,
    } = bag;

    var ageFrameFiltersForStudy = groupBy({
        items: ageFrameFilters,
        byProp: 'studyId'
    });

    for (var subject of subjectRecords) {
        //console.log(subject._id);
        var dateOfBirth = jsonpointer.get(subject, '/_ageFrameField');
        
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
           
            //console.dir({
            //    dateOfBirth,
            //    desiredTestInterval,
            //    ageFrameIntervals: ageFrameFilters.map(it => it.interval)
            //}, { depth: null });
            var ageFrameIntervals = ageFrameFilters.map(it => it.interval);
            var testableIntervals = calculateTestableIntervals({
                desiredTestInterval,
                dateOfBirth,
                ageFrameIntervals,
            });
            // NOTE: same as above but ignoring desiredTestInterval
            var ageFrameMatchIntervals = calculateTestableIntervals({
                dateOfBirth,
                ageFrameIntervals,
            });
            //console.log(datefns.add(dateOfBirth, { years: 22, months: 1 }));
            //console.log({ testableIntervals });

            // NOTE: client wants utc version of
            // its local date-only value
            var convert = (intervals) => intervals.map(interval => (
                convertIntervalTZ(
                    interval, { sourceTZ: clientTimezone }
                )
            ));
            //console.log(clientTimezone);
            //console.dir({ testableIntervals }, { depth: null });
        
            subject[`_testableIntervals_${studyId}`] = (
                convert(testableIntervals)
            );
            subject[`_ageFrameIntervals_${studyId}`] = (
                convert(ageFrameMatchIntervals)
            );
        }
    }
}

module.exports = augmentSubjectTestableIntervals;
