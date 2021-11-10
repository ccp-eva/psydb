'use strict';
var debug = require('debug')('psydb:api:endpoints:self:researchGroups');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ResponseBody,
    createRecordLabel,
} = require('@mpieva/psydb-api-lib');
    
var {
    MatchAlwaysStage,
    StripEventsStage
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var researchGroups = async (context, next) => {
    var { db, permissions } = context;
    var { hasRootAccess, allowedResearchGroupIds } = permissions;

    var MatchStage = (
        hasRootAccess
        ? MatchAlwaysStage()
        : (
            { $match: {
                _id: { $in: allowedResearchGroupIds }
            }}
        )
    )

    var records = await (
        db.collection('researchGroup').aggregate([
            MatchStage,
            StripEventsStage()
        ]).toArray()
    )

    records = records.map(it => ({
        _id: it._id,
        _recordLabel: createRecordLabel({
            record: it,
            definition: (
                allSchemaCreators.researchGroup.recordLabelDefinition
            )
        })
    }))

    context.body = ResponseBody({
        data: { records }
    });

    await next();
}

module.exports = researchGroups;
