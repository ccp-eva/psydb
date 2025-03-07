'use strict';

var { ExactObject, IdList } = require('@mpieva/psydb-schema-fields');

var {
    ApiError,
    ResponseBody,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    withContext
} = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');

var readMany = async (context, next) => {
    var { db } = context;
    var {
        augmentWithPayload,
        validate,
        verifyPayloadId,
    } = withContext(context);
    
    augmentWithPayload();
    await validate({ createSchema: () => Schema() });

    var { ids } = context.payload;

    var records = await (
        db.collection('subject').find({
            _id: { $in: ids }
        }).toArray()
    );
    // TODO: handle permissions
    // TODO: apply _recordLabel
    // TODO: handle removed fields

    var related = await fetchRelatedLabelsForMany({
        db, collectionName: 'subject', records,
    });

    context.body = ResponseBody({
        data: { records, ...related }
    });

    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            ids: IdList({ collection: 'subject' }),
        },
        required: [ 'ids' ]
    });
}

module.exports = readMany;
