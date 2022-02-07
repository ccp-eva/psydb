'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');

var getSubjectStudyCRTs = async (context, next) => {
    var { db, params } = context;
    var { subjectType } = params;

    // NOTE: currently thats all available study types
    // but we probably need to introduce a relation to the types
    // to restrict what study type can actually access what subjects
    var results = await (
        db.collection('customRecordType')
        .find({ collection: 'study' }, { projection: { type: true } })
        .toArray()
    );
    context.body = ResponseBody({ data: results.map(it => it.type) });
    await next();
}

module.exports = getSubjectStudyCRTs;
