'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var { withContext } = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');


var relatedExperiments = async (context, next) => {
    var { permissions } = context;
   
    // TODO
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        augmentWithPayload,
        validate,
        verifyPayloadId,
        SimpleRecordList,
    } = withContext(context);

    augmentWithPayload();

    await validate({
        createSchema: () => merge(
            Schema(),
            SimpleRecordList.createSchema()
        )
    });

    await verifyPayloadId({
        collection: 'csvImport',
        pointer: '/csvImportId',
    });

    var { csvImportId } = context.payload;

    var data = await SimpleRecordList.fetchData({
        collection: 'experiment',
        filter: {
            csvImportId
        },
        sort: { 'state.interval.start': 1 }
    });

    context.body = ResponseBody({ data });
    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            csvImportId: Id({ collection: 'csvImport' }),
        },
        required: [ 'csvImportId' ]
    });
}

module.exports = relatedExperiments;
