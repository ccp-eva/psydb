'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var { ExactObject, Id, DefaultBool } = require('@mpieva/psydb-schema-fields');
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var { withContext } = require('@mpieva/psydb-api-lib/src/list-endpoint-utils');


var relatedExperiments = async (context, next) => {
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
        collection: 'location',
        pointer: '/locationId',
    });

    var {
        locationId,
        includePastExperiments = false,
    } = context.payload;

    var data = await SimpleRecordList.fetchData({
        collection: 'experiment',
        filter: {
            'state.locationId': locationId,
            'state.isCanceled': { $ne: true },
            ...(!includePastExperiments && {
                $or: [
                    { 'state.interval.start': { $gte: new Date() }},
                    { 'state.isPostprocessed': { $ne: true }}
                ]
            })
        },
        sort: { 'state.interval.start': 1 }
    });

    context.body = ResponseBody({ data });
    await next();
}

var Schema = () => {
    return ExactObject({
        properties: {
            locationId: Id({ collection: 'location' }),
            includePastExperiments: DefaultBool(),
        },
        required: [ 'locationId' ]
    });
}

module.exports = relatedExperiments;
