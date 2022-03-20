// OpsTeam
'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
);

var {
    createSchemaForRecordType,
    fetchRelatedLabels,
} = require('@mpieva/psydb-api-lib');

var fetchOneOpsTeamData = async (options) => {
    var { db, _id } = options;

    debug('fetch operator team record');
    var opsTeamRecord = await (
        db.collection('experimentOperatorTeam').findOne({
            _id
        }, { projection: { _rohrpostMetadata: false }})
    );

    debug('fetch operator team record schema');
    var opsTeamRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'experimentOperatorTeam',
        recordType: opsTeamRecord.type,
        fullSchema: true
    });

    debug('fetch operator team record related labels');
    var opsTeamRelated = await fetchRelatedLabels({
        db,
        data: opsTeamRecord,
        schema: opsTeamRecordSchema,
    });
    
    return {
        record: opsTeamRecord,
        related: opsTeamRelated,
    }
}

module.exports = fetchOneOpsTeamData;
