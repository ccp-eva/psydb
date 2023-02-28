'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:channelHistory'
);

var {
    ejson,
    groupBy,
    keyBy,
    compareIds
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    generateChannelHistory
} = require('@mpieva/psydb-api-lib');

var {
    ExactObject,
    Id
} = require('@mpieva/psydb-schema-fields');

var ParamsSchema = () => ExactObject({
    properties: {
        channelId: Id(),
    },
    required: [
        'channelId',
    ]
});

var channelHistory = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    validateOrThrow({
        schema: ParamsSchema(),
        payload: params
    })

    var { channelId } = params;

    var history = await generateChannelHistory({
        db, channelId,
        omit: [
            'state.internals',
            'scientific.state.internals',
            'gdpr.state.internals'
        ]
    });

    context.body = ResponseBody({
        data: history
    });
    await next();
};

module.exports = channelHistory;
