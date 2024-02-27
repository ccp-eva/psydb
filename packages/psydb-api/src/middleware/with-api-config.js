'use strict';

var withApiConfig = (config) => async (context, next) => {
    context.apiConfig = config;
    await next();
}

module.exports = withApiConfig;
