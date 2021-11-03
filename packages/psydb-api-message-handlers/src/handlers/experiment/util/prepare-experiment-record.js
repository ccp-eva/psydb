'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');

var prepareExperimentRecord = async (context, options) => {
    var { db, cache } = context;
    var { experimentType, experimentId } = options;
    
    var experimentRecord = await (
        db.collection('experiment').findOne({
            _id: experimentId,
            type: experimentType,
        })
    );

    if (!experimentRecord) {
        throw new ApiError(400, 'InvalidExperimentId');
    }

    cache.experimentRecord = experimentRecord;
}

module.exports = prepareExperimentRecord;
