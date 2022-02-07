'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');

var {
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

var getSubjectStudyCRTs = async (context, next) => {
    var { db, params } = context;
    var { subjectType } = params;

    // NOTE: currently thats all available study types
    // but we probably need to introduce a relation to the types
    // to restrict what study type can actually access what subjects
    var results = await (
        db.collection('customRecordType')
        .find({ collection: 'study' }, { projection: {
            type: true,
            'state.label': true,
        }})
        .toArray()
    );
    
    context.body = ResponseBody({ data: results.map(it => ({
        type: it.type,
        label: it.state.label
    }))});

    await next();
}

module.exports = getSubjectStudyCRTs;
