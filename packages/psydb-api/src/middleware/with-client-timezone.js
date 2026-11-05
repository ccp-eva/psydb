'use strict';

var withClientTimezone = () => async (context, next) => {
    var { request } = context;
    // TODO: check headers with ajv
    var { timezone } = request.header;
    
    context.timezone = timezone;
    
    await next();
}

module.exports = withClientTimezone;
