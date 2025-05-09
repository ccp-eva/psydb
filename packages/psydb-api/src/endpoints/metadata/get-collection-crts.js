'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');

var {
    ResponseBody,
    withRetracedErrors
} = require('@mpieva/psydb-api-lib');


var getCollectionCRTs = async (context, next) => {
    var { db, params } = context;
    var { collectionName } = params;
    
    var results = await withRetracedErrors(
        db.collection('customRecordType')
        .find({
            collection: collectionName,
            'state.internals.isRemoved': { $ne: true }
        }, { projection: {
            type: true,
            'state.label': true,
            'state.displayNameI18N': true,
            'state.hasSubChannels': true,
        }})
        .toArray()
    );

    context.body = ResponseBody({ data: results.map(it => ({
        type: it.type,
        label: it.state.label,
        displayNameI18N: it.state.displayNameI18N,
    }))});

    await next();
}

module.exports = getCollectionCRTs;
