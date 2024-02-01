'use stirct';
var { ResponseBody } = require('@mpieva/psydb-api-lib');

var withDefaultResponseBody = async (context, next) => {
    context.response.body = ResponseBody({
        statusCode: 200,
        data: context.modifiedChannels
    });

    await next();
}

module.exports = withDefaultResponseBody;
