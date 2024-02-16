'use strict';

var withErrorHandling = (cliOptions) => async (context, next) => {
    try {
        await next();
    }
    catch (e) {
        throw e;
    }
    finally {
        // send mail to somewhere
    }
}

module.exports = withErrorHandling;
