'use strict';
var debug = require('./debug-helper')('verifyOneRecordAccess()');

var { ApiError } = require('@mpieva/psydb-api-lib');
var noop = require('../noop');

var verifyOneRecordAccess = (bag) => {
    var { collection, level, by: resolveRecord } = bag;
    
    var verifyOneRecordAccess_MW = async (context, next = noop) => {
        var { db, message, cache, permissions } = context;
        var record = resolveRecord({ message, cache });
        debug({ collection, level });
        
        var ok = permissions.hasRecordAccess({
            record, collection, level,
        });
    
        if (!ok) {
            throw new ApiError(403)
        }

        await next();
    }

    return verifyOneRecordAccess_MW;
}

module.exports = { verifyOneRecordAccess };
