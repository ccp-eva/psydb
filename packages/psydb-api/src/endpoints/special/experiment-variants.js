'use strict';
// FIXME maybe rename to lapProcedure labProcedureSetting
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariants'
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

var experimentVariants = async (context, next) => {
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

    var records = await db.collection('experimentVariant').find({
        studyId: { $in: studyIds }
    }).toArray();

    context.body = ResponseBody({
        data: {
            records,
        },
    });

    await next();
}

module.exports = experimentVariants;
