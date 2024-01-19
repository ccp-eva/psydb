'use stirct';
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var withResponseBody = async (context, next) => {
    var { cache } = context;
    if (cache.remoteErrors) {
        //context.status = 700;
        context.body = ResponseBody({
            // XXX not sure if 700; but needs handling in 'with-ajv-errors'
            statusCode: 200,
            data: context.modifiedChannels,
            // XXX: not sure about prop name
            remoteErrors: cache.remoteErrors.map(it => (
                it.getInfo()
            )),
        });
    }
    else {
        context.body = ResponseBody({
            statusCode: 200,
            data: context.modifiedChannels
        });
    }
    await next();
}

module.exports = withResponseBody;
