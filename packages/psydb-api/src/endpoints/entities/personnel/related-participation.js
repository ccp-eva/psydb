'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var { withContext } = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');


var relatedParticipation = async (context, next) => {
    var { db } = context;
    var {
        augmentWithPayload,
        validate,
        verifyPayloadId,
    } = withContext(context);

    augmentWithPayload();

    await validate({ createSchema: Schema });

    await verifyPayloadId({
        collection: 'personnel',
        pointer: '/personnelId',
    });

    var { personnelId } = context.payload;

    var path = 'scientific.state.internals.participatedInStudies';
    var records = await db.collection('subject').aggregate([
        { $unwind: '$' + path },
        { $match: {
            [`${path}.experimentOperatorIds`]: personnelId
        }},
        { $replaceRoot: {
            newRoot: '$' + path
        }},
        // FIXME: group by timestamp? and location?
    ], {
        allowDiskUse: true,
        collation: { locale: 'de@collation=phonebook' }
    }).toArray();

    context.body = ResponseBody({ data: { records, related: {}} });
    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            personnelId: Id({ collection: 'personnel' }),
        },
        required: [ 'personnelId' ]
    });
}

module.exports = relatedParticipation;
