'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentOperatorTeamsForStudy'
);

var { ejson, compareIds } = require('@mpieva/psydb-core-utils');

var {
    ResponseBody,

    validateOrThrow,
    withRetracedErrors,
    aggregateToArray,
    verifyStudyAccess,

    createRecordLabel,
    fetchRecordById,
    createSchemaForRecordType,
    fetchRelatedLabelsForMany,
    SmartArray
} = require('@mpieva/psydb-api-lib');

var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var RequestParamsSchema = () => ExactObject({
    properties: {
        studyId: ForeignId({ collection: 'study' }),
    },
    required: [
        'studyId',
    ]
})

var experimentOperatorTeamsForStudy = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    validateOrThrow({
        schema: RequestParamsSchema(),
        payload: params
    })

    var {
        studyId,
    } = params;

    var canChangeOpsTeam = (
        permissions.hasSomeLabOperationFlags({
            types: 'any',
            flags: [ 'canChangeOpsTeam' ]
        })
    );
    // FIXME: this is incomplete
    // we need to check if the studies
    // research groups match with the users
    if (!canChangeOpsTeam) {
        await verifyStudyAccess({
            db,
            permissions,
            studyId,
            action: 'read',
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
    var teamRecords = await withRetracedErrors(
        aggregateToArray({ db, experimentOperatorTeam: teamStages })
    );

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
