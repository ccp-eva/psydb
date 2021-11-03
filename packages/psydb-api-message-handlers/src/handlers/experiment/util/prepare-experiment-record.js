'use strict';
var debug = require('../debug-helper')('utils:prepare-experiment-record');
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
        throw new ApiError(400, {
            apiStatus: 'InvalidExperimentId',
            data: { experimentType, experimentId }
        });
    }
    if (experimentRecord.state.isCanceled) {
        throw new ApiError(400, {
            apiStatus: 'ExperimentIsCanceled',
            data: { experimentType, experimentId }
        });
    }

    cache.experimentRecord = experimentRecord;
}

module.exports = prepareExperimentRecord;
