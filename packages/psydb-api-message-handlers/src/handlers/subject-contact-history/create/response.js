'use strict';
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var createResponseBody = async (context) => {
    var { cache, response } = context;
    var { subjectContactHistoryId } = cache.get();
    
    response.body = ResponseBody({
        data: { subjectContactHistoryId }
    });
}

module.exports = { createResponseBody }
