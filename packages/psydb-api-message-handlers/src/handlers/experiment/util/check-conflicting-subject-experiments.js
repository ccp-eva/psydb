'use strict';
var debug = require('debug')('psydb:api:message-handlers');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var checkConflictingSubjectExperiments = async ({
    db,
    subjectIds,
    interval
}) => {
    var conflicting = await (
        db.collection('experiment')
        .aggregate([
            { $match: {
                // we are switching to half open intervals
                // i.e. ends are set on .000Z
                // therefor $lt is the way to go
                'state.interval.start': { $lt: interval.end },
                'state.interval.end': { $gt: interval.start },
                'state.isCanceled': false,
            }},
            { $unwind: '$state.subjects' },
            { $match: {
                'state.subjects.subjectId': { $in: subjectIds },
            }},
            { $project: {
                subjectId: '$state.subjects.subjectId',
            }}
        ])
        .toArray()
    );

    if (conflicting.length > 0) {
        // TODO: subject ids => response body
        throw new ApiError(400, 'ConflictingExperiments');
    }
};

module.exports = checkConflictingSubjectExperiments;
