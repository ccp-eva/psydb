'use strict';
var debug = require('debug')('psydb:api:middleware:content-encoding-protection');
var { ApiError } = require('@mpieva/psydb-api-lib');

// NOTE: only allow uncompressed, gzip or deflate request bodies;
// rejects e.g. brotli (CVE-2026-111497, node2shell)
var allowedEncodings = [ 'identity', 'gzip', 'deflate' ];

var createContentEncodingProtectionMiddleware = () => async (context, next) => {
    var encoding = context.get('content-encoding');

    if (encoding && !allowedEncodings.includes(encoding)) {
        debug('unsupported content encoding', encoding);
        // NOTE: see RFC 9110 section 15.5.16
        context.set('Accept-Encoding', allowedEncodings.join(', '));
        throw new ApiError(415, 'UnsupportedContentEncoding');
    }

    await next();
}

module.exports = createContentEncodingProtectionMiddleware;
