'use strict';

var withClientTimezone = () => async (context, next) => {
    var { request } = context;
    var { timezone } = request.header;
    
    context.timezone = timezone;
    
    await next();
}

module.exports = withClientTimezone;
