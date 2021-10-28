'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:subjectSelectors'
);

var Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

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

var subjectSelectors = async (context, next) => {
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

    var { studyIds } = request.body;

    var records = await db.collection('subjectSelector').find({
        studyId: { $in: studyIds }
    }).toArray();

    context.body = ResponseBody({
        data: {
            records,
        },
    });

    await next();
}

module.exports = subjectSelectors;
