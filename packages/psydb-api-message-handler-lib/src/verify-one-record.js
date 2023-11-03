'use strict';
var jsonpointer = require('jsonpointer');
var { ApiError } = require('@mpieva/psydb-api-lib');
var noop = require('./noop');

var verifyOneRecord = (...args) => {
    var bag = (
        args.length > 1
        ? {
            collection: args[0],
            by: args[1],
            ...(args[2] || {})
        }
        : args[0]
    );

    var {
        collection,
        by: pointer,
        fakeAjvError = false, // TODO
        cache: shouldCacheRecord = false,
        as: cacheAs
    } = bag;

    var [ apiCode, apiStatus ] = (
        fakeAjvError
        ? [ 400, 'InvalidMessageSchema' ]
        : [ 409, 'MessageDataConflict' ]
    );
    
    var resolveId = ({ message }) => (
        jsonpointer.get(message, pointer)
    );

    return async (context, next = noop) => {
        var { db, message, cache } = context;
        
        var recordId = resolveId({ message });

        var record = await (
            db.collection(collection)
            .findOne({ _id: recordId })
        );
        if (!record) {
            throw new ApiError(apiCode, {
                apiStatus,
                data: (
                    fakeAjvError
                    ? { ajvErrors: [ /* TODO */] }
                    : { pointer }
                )
            });
        }
        if (shouldCacheRecord) {
            cache.merge({ [cacheAs || collection]: record })
        }

        await next();
    }
}

module.exports = { verifyOneRecord };
