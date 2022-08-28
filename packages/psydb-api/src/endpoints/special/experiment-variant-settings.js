'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariantSettings'
);

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ResponseBody,
    validateOrThrow,
    verifyStudyAccess,

    fetchRelatedLabels,
} = require('@mpieva/psydb-api-lib');

var {
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var {
    ExactObject,
    ForeignIdList,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyIds: ForeignIdList({ collection: 'study' }),
        subjectTypes: {
            type: 'array',
            items: CustomRecordTypeKey({ collection: 'subject' }),
            minItems: 1
        },
        types: {
            type: 'array',
            items: { type: 'string' }, // FIXME
            minItems: 1
        },
    },
    required: [
        'studyIds',
    ]
})

var experimentVariantSettings = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    var { studyIds, subjectTypes, types } = request.body;

    var hasOtherPermission = (
        permissions.hasSomeLabOperationFlags({
            types: 'any',
            flags: [ 'canMoveAndCancelExperiments' ]
        })
    );
    // FIXME: this is incomplete
    // we need to check if the studies
    // research groups match with the users
    if (!hasOtherPermission) {
        await verifyStudyAccess({
            db,
            permissions,
            studyIds,
            action: 'read',
        });
    }

    var records = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: studyIds },
                ...(types && {
                    type: { $in: types }
                }),
                ...( subjectTypes && {
                    'state.subjectTypeKey': { $in: subjectTypes }
                })
            }},
    
            AddLastKnownEventIdStage(),
            StripEventsStage(),
        ]).toArray()
    )

    var creators = (
        allSchemaCreators
        .experimentVariantSetting.fixedTypeStateSchemaCreators
    );

    var recordSchema = { type: 'object', properties: {
        records: {
            type: 'array', items: {
                lazyResolveProp: 'type',
                oneOf: (
                    Object.keys(creators).map(key => ({
                        type: 'object',
                        properties: {
                            type: { const: key },
                            state: creators[key]()
                        }
                    }))
                )
            }
        }
    }};

    var related = await fetchRelatedLabels({
        db,
        data: { records },
        schema: recordSchema,
    });

    context.body = ResponseBody({
        data: {
            records,
            ...related
        },
    });

    await next();
}

module.exports = experimentVariantSettings;
