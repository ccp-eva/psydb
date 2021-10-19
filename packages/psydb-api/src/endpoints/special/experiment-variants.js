'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariants'
);

var Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

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

var experimentVariants = async (context, next) => {
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

    var records = await db.collection('experimentVariant').find({
        studyId
    }).toArray();

    context.body = ResponseBody({
        data: {
            records,
        },
    });

    await next();
}

module.exports = experimentVariants;
