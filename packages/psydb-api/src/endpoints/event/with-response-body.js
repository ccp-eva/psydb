'use stirct';
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var withResponseBody = async (context, next) => {
    context.body = ResponseBody({
        statusCode: 200,
        data: context.modifiedChannels
    });

    await next();
}

module.exports = withResponseBody;
