'use stirct';
var ResponseBody = require('../../lib/response-body');

var withResponseBody = async (context, next) => {
    context.body = ResponseBody({
        statusCode: 200,
        data: context.modifiedChannels
    });

    await next();
}

module.exports = withResponseBody;
