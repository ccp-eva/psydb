'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');

var {
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

var getCollectionCRTs = async (context, next) => {
    var { db, params } = context;
    var { collectionName } = params;
    
    var results = await (
        db.collection('customRecordType')
        .find({ collection: collectionName }, { projection: {
            type: true,
            'state.label': true,
            'state.hasSubChannels': true,
            'state.internals.isRemoved': { $ne: true }
        }})
        .toArray()
    );

    context.body = ResponseBody({ data: results.map(it => ({
        type: it.type,
        label: it.state.label
    }))});

    await next();
}

module.exports = getCollectionCRTs;
