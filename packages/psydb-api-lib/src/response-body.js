'use strict';
var debug = require('debug')('psydb:api:lib:response-body');
var getHttpStatus = require('./psydb-http-statuses');

var psydbExtraStatuses = {
    // NOTE: when the server deletgates internally
    // i.e. to aother service we control
    '600': 'Internal Delegation Error',
    // NOTE: when the server deletgates externally
    // i.e. requesting a service we have no control over
    '700': 'External Delegation Error',
}

var ResponseBody = ({
    statusCode,
    apiStatus,
    data,
    remoteErrors
}) => {
    statusCode = statusCode || 200;
    var status = getHttpStatus(statusCode);
    return ({
        statusCode,
        status,
        apiStatus: apiStatus || status,
        data: data || {},
        remoteErrors, // XXX: not sure about prop name
    });
}

module.exports = ResponseBody;
