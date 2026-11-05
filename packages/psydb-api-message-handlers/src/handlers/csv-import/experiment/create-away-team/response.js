'use strict';
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var createResponseBody = async (context) => {
    var { cache, response } = context;
    var { csvImportId } = cache.get();
    
    response.body = ResponseBody({
        data: { csvImportId }
    });
}

module.exports = { createResponseBody }
