'use strict';
var debug = require('debug')('psydb:api:endpoints:self:account');
var { ApiError } = require('@mpieva/psydb-api-lib');

var self = async (context, next) => {
    var { self, permissions } = context;

    if (!self) {
        debug('self not set in context');
        throw new ApiError(401); // TODO
    }

    if (self.requires2FACode) {
        debug('self requires 2FA code');
        throw new ApiError(803); // TODO
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
