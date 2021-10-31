'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariants'
);

var { getSystemTimezone } = require('@mpieva/psydb-timezone-helpers');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var serverTimezone = async (context, next) => {
    var d = new Date();
    context.body = ResponseBody({
        data: { timezone: getSystemTimezone() },
    });

    await next();
}

module.exports = serverTimezone;
