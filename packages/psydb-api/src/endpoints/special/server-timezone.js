'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariants'
);

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var serverTimezone = async (context, next) => {
    var d = new Date();
    context.body = ResponseBody({
        data: { timezoneOffset: d.getTimezoneOffset() },
    });

    await next();
}

module.exports = serverTimezone;
