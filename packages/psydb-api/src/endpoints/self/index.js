'use strict';
var debug = require('debug')('psydb:api:endpoints:self');

var self = async (context, next) => {
    var { self } = context;

    if (!self) {
        debug('self not set in context');
        throw new Error(401); // TODO
    }

    context.body = {
        data: self,
    };

    await next();
}

module.exports = self;
