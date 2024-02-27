'use strict';

var withPsydbDriver = (cliOptions) => async (context, next) => {
    await next();
}

module.exports = withPsydbDriver;
