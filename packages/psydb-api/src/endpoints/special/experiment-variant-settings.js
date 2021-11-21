'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariantSettings'
);

var {
    validateOrThrow,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

var {
    AddLastKnownEventIdStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchRelatedLabels = require('@mpieva/psydb-api-lib/src/fetch-related-labels');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyIds: ForeignIdList({ collection: 'study' }),
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

    // TODO: permissions

    var { studyIds } = request.body;

    var records = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: studyIds }
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
