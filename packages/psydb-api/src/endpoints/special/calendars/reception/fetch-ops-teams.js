'use strict';
var {
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchOpsTeams = async (context, options) => {
    var { db } = context;
    var { opsTeamIds } = options;

    var records = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                _id: { $in: opsTeamIds },
            }},
            StripEventsStage(),
        ]).toArray()
    );
    
    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experimentOperatorTeam',
        records,
    })

    return {
        records,
        related
    }
}

module.exports = fetchOpsTeams;
