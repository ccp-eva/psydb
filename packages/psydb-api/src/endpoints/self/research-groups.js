'use strict';
var debug = require('debug')('psydb:api:endpoints:self:researchGroups');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ResponseBody,
    applyRecordLabels
} = require('@mpieva/psydb-api-lib');
    
var {
    MatchAlwaysStage,
    StripEventsStage
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var researchGroups = async (context, next) => {
    var { db, permissions } = context;

    var MatchStage = (
        permissions.isRoot()
        ? MatchAlwaysStage()
        : (
            { $match: {
                _id: { $in: permissions.getResearchGroupIds() }
            }}
        )
    )

    var records = await (
        db.collection('researchGroup').aggregate([
            MatchStage,
            StripEventsStage()
        ]).toArray()
    )

    applyRecordLabels({
        records,
        definition: (
            allSchemaCreators.researchGroup.recordLabelDefinition
        )
    });

    records = records.map(it => ({
        _id: it._id,
        _recordLabel: it._recordLabel
    }));

    context.body = ResponseBody({
        data: { records }
    });

    await next();
}

module.exports = researchGroups;
