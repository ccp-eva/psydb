'use strict';
var debug = require('debug')('psydb:api:middleware:errors'),
    httpStatuses = require('statuses'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var createErrorsMiddleware = () => async (context, next) => {
    try {
        await next();
    }
    catch (error) {

        var shouldEmitError = false;
        
        var statusCode,
            apiStatus,
            data;

        if (error instanceof ApiError) {
            var info = error.getInfo();
            debug(error)
            debug({ ERROR_INFO: info });

            ({
                statusCode,
                apiStatus,
                data
            } = error.getInfo());

            if (!statusCode || statusCode >= 500) {
                shouldEmitError = true;
            }
        }
        else {
            debug(error);

            statusCode = 500;
            shouldEmitError = true;
        }
       
        context.status = statusCode,
        context.body = ResponseBody({
            statusCode,
            apiStatus,
            // FIXME: data = error.message?
            //  => conflicts when we actually want to send
            // the stack
            data: {
                message: error.message,
                ...data,
            }
        });

        if (shouldEmitError) {
            context.app.emit('error', error, context);
        }
    }
}

module.exports = createErrorsMiddleware;
