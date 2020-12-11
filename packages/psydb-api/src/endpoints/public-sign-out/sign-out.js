'use strict';
var signOut = async (context, next) => {
    
    context.session = null;
    context.body = { data: {}};

    await next();
}

module.exports = signOut;
