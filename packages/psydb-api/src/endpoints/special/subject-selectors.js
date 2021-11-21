'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:subjectSelectors'
);

var {
    validateOrThrow,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

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

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    // TODO: permissions
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
