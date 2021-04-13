'use strict';
var debug = require('debug')('psydb:api:endpoints:read');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var metadata = async (context, next) => {
    var { 
        db,
    } = context;

    var customRecordTypes = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                'state.isNew': false
            }},
            { $project: {
                collection: true,
                type: true,
                'state.label': true,
            }}
        ]).toArray()
    );

    context.body = ResponseBody({
        data: {
            customRecordTypes
        }
    });

    await next();
}

module.exports = metadata;
