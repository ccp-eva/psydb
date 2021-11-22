'use strict';
var debug = require('debug')('psydb:api:endpoints:self:account');

var self = async (context, next) => {
    var { self, permissions } = context;

    if (!self) {
        debug('self not set in context');
        throw new Error(401); // TODO
    }

    context.body = {
        data: {
            record: self.record,
            permissions,
        },
    };

    await next();
}

module.exports = self;
