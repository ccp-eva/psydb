'use strict';
var { RemapMailError } = require('../errors');
var { sendErrorMail } = require('../utils');

var withGeneralErrorHandling = (cliOptions) => async (context, next) => {
    context.caughtErrors = [];
    try {
        await next();
    }
    catch (e) {
        context.caughtErrors.push({ e });
    }
    finally {
        if (context.caughtErrors.length > 0) {
            await sendErrorMail({
                cliOptions,
                caughtErrors: context.caughtErrors
            });
        }
    }
}

module.exports = { withGeneralErrorHandling }
