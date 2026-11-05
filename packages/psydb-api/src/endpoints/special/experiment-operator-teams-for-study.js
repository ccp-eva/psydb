'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentOperatorTeamsForStudy'
);

var { ejson } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var {
    ResponseBody, validateOrThrow,
    verifyPermissionFlags, verifyStudyAccess,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var ParamsSchema = () => ClosedObject({
    'studyId': ForeignId({ collection: 'study' }),
})

var experimentOperatorTeamsForStudy = async (context, next) => {
    var { db, permissions, params } = context;

    validateOrThrow({
        schema: ParamsSchema(),
        payload: params
    })

    var { studyId } = params;

    // NOTE: if you can change the ops team for
    // lab operation this takes precedent as its needed in calednars n such
    var canChangeOpsTeam = permissions.hasSomeLabOperationFlags({
        types: 'any', flags: [ 'canChangeOpsTeam' ]
    });

    // FIXME: this is incomplete
    // we need to check if the studies
    // research groups match with the users
    if (!canChangeOpsTeam) {
        await verifyPermissionFlags({
            db, permissions, flags: [ 'canViewStudyLabTeams' ], match: 'some'
        });

        await verifyStudyAccess({
            db, permissions, studyId, action: 'read',
        });
    }
    
    var teamStages = [
        { $match: {
            studyId,
            $or: [
                { 'state.researchGroupId': { $in: (
                    permissions.getResearchGroupIds()
                )}},
                { 'state.researchGroupId': { $exists: false }}
            ]
        }},
        { $project: {
            events: false
        }},
    ];
    //console.dir(ejson(teamStages), { depth: null })
    var teamRecords = await aggregateToArray({
        db, experimentOperatorTeam: teamStages
    });

    var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experimentOperatorTeam',
        records: teamRecords,
    });

    context.body = ResponseBody({
        data: {
            records: teamRecords,
            relatedRecordLabels: relatedRecords,
        },
    });

    await next();
};

module.exports = experimentOperatorTeamsForStudy;
