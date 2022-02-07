'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');

var getCollectionCRTs = async (context, next) => {
    var { db, params } = context;
    var { collectionName } = params;
    
    var results = await (
        db.collection('customRecordType')
        .find({ collection: collectionName }, { projection: { type: true } })
        .toArray()
    );

    context.body = ResponseBody({ data: results.map(it => it.type) });
    await next();
}

module.exports = getCollectionCRTs;
