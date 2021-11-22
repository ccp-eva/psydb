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
    fetchRelatedLabels,
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

    await verifyStudyAccess({
        db,
        permissions,
        studyId,
        action: 'read',
    });

    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                studyId,
            }},
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    var recordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'experimentOperatorTeam',
        fullSchema: true
    });

    // FIXME: this is really hacky
    var resolveSchema = {
        type: 'object',
        properties: {
            records: {
                type: 'array',
                items: recordSchema,
            }
        }
    }

    var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabels({
        db,
        data: { records: experimentOperatorTeamRecords },
        schema: resolveSchema,
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
