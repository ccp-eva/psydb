'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariantSettings'
);

var Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var fetchRelatedLabels = require('@mpieva/psydb-api-lib/src/fetch-related-labels');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyId: ForeignId({ collection: 'study' }),
    },
    required: [
        'studyId',
    ]
})

var experimentVariantSettings = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        RequestBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema', {
            ajvErrors: ajv.errors
        });
    };

    var { studyId } = request.body;

    var records = await db.collection('experimentVariantSetting').find({
        studyId
    }).toArray();

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
