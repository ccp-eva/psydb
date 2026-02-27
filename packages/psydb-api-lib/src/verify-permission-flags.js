'use strict';
var ApiError = require('./api-error');

// NOTE: currently does not need to be async i want to match other signatures
var verifyPermissionFlags = async (bag) => {
    var { permissions, flags, match = 'every' } = bag;
    
    var ok = false;
    switch (match) {
        case 'some':
            ok = permissions.hasSomeFlags(flags);
            break;
        case 'all':
            ok = permission.hasFlags(flags);
            break;
        default:
            throw new Error(`unknown match value "${match}"`);
    }

    if (!ok) {
        throw new ApiError(403, {
            apiStatus: 'AccessDenied',
            data: { flags, match }
        })
    }
}

module.exports = verifyPermissionFlags;
