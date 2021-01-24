'use stirct';
var ResponseBody = require('../../lib/response-body');

var withResponseBody = async (context, next) => {
    context.body = ResponseBody({
        statusCode: 200,
        data: context.rohrpost.getModifiedChannels()
    });

    await next();
}

module.exports = withResponseBody;
