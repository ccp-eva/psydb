'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentOperatorTeamsForStudy'
);

var {
    compareIds
} = require('@mpieva/psydb-core-utils');

var {
    ResponseBody,

    validateOrThrow,
    verifyStudyAccess,

    createRecordLabel,
    fetchRecordById,
    createSchemaForRecordType,
    fetchRelatedLabelsForMany,
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


    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                studyId,
                ...(!permissions.isRoot() && {
                    'state.researchGroupId': { $in: (
                        permissions.getResearchGroupIds()
                    )}
                })
            }},
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experimentOperatorTeam',
        records: experimentOperatorTeamRecords,
    });

    context.body = ResponseBody({
        data: {
            records: experimentOperatorTeamRecords,
            relatedRecordLabels: relatedRecords,
        },
    });

    await next();
};

module.exports = experimentOperatorTeamsForStudy;
