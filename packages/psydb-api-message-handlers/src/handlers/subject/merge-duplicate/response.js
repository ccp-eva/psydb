'use strict';
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var createResponseBody = async (context) => {
    var { cache, response } = context;
   
    // TODO: what to respond with?
    response.body = ResponseBody({
        data: {}
    });
}

module.exports = { createResponseBody }
