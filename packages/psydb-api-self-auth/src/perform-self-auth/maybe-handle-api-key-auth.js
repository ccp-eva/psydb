'use strict';
var debug = require('debug')('psydb:api-self-auth:maybeHandleApiKeyAuth');
var checkIpInRange = require('@cdxoo/check-ip-in-range');

var { hasNone, hasOnlyOne } = require('@mpieva/psydb-core-utils');
var { ApiError, Self, withRetracedErrors } = require('@mpieva/psydb-api-lib');

var maybeHandleApiKeyAuth = async (bag) => {
    var { db, request, ip, apiConfig } = bag;
    var { isEnabled, allowedIps } = apiConfig.apiKeyAuth;
    var { apiKey } = request.query;

    if (!isEnabled) {
        return;
    }

    var isAllowed = false;
    for (var range of allowedIps) {
        try {
            isAllowed = checkIpInRange({ range, ip });
        }
        catch (e) {
            console.warn(e);
        }
        if (isAllowed) {
            break;
        }
    }

    if (!isAllowed) {
        debug('ip address is not allowed')
        throw new ApiError(401, {
            apiStatus: 'IpAddressNotAllowed',
            ip, // FIXME
            data: { ip }
        }) // TODO
    }
    
    debug('ip:', ip);
    debug('apiKey:', apiKey);

    var apiKeyRecords = await withRetracedErrors(
        db.collection('apiKey').find({
            'apiKey': apiKey,
            'state.internals.isRemoved': { $ne: true }
        }).toArray()
    );

    if (hasNone(apiKeyRecords)) {
        debug('cant find apiKey')
        throw new ApiError(401) // TODO
    }
    if (!hasOnlyOne(apiKeyRecords)) {
        debug('found duplicate apiKey')
        throw new ApiError(409) // TODO
    }

    return apiKeyRecords[0].personnelId;
}

module.exports = maybeHandleApiKeyAuth;
