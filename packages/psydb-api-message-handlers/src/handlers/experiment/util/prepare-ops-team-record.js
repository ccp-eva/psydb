'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');

var prepareOpsTeamRecord = async (context, options) => {
    var { db, cache } = context;
    var { studyId, opsTeamId, } = options;
    
    var opsTeamRecord = await (
        db.collection('experimentOperatorTeam').findOne({
            _id: opsTeamId,
            studyId,
        })
    )

    if (!opsTeamRecord) {
        throw new ApiError(400, 'InvalidExperimentOperatorTeamId');
    }

    cache.opsTeamRecord = opsTeamRecord;
}

module.exports = prepareOpsTeamRecord;
