'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var getCustomRecordTypes = async (context, next) => {
    var { 
        db,
    } = context;

    var customRecordTypes = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                'state.isNew': false
            }},
            { $project: {
                events: false,
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

module.exports = getCustomRecordTypes;
