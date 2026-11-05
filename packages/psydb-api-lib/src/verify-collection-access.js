'use strict';
var ApiError = require('./api-error');

// FIXME: make this async to match other signatures
var verifyCollectionAccess = (bag) => {
    var { permissions, collection, flag, statusCode = 403 } = bag;

    var canAccess = permissions.hasCollectionFlag(collection, flag);
    if (!canAccess) {
        throw new ApiError(403);
    }
}

module.exports = { verifyCollectionAccess };
