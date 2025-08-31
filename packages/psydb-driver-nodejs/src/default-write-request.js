'use strict';
var debug = require('debug')('psydb:driver-nodejs');

var { getSystemTimezone } = require('@mpieva/psydb-timezone-helpers');
var maybeInjectApiKey = require('./maybe-inject-api-key');
var handleError = require('./handle-error');

var defaultWriteRequest = async (bag) => {
    var { agent, url, payload, options = {}} = bag;
    var { apiKey, i18n, forceTZ = false } = options;

    url = maybeInjectApiKey({ url, apiKey })

    try {
        var body = {
            timezone: forceTZ || getSystemTimezone(), // FIXME: headers
            ...payload,
        };
        debug(agent?.defaults?.baseURL, url, JSON.stringify(body));
        var response = await agent.post(url, body);
    }
    catch (e) {
        handleError(e);
    }

    return response;
}


module.exports = defaultWriteRequest;
