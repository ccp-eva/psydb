'use strict';
var debug = require('debug')('psydb:api:lib:response-body'),
    httpStatuses = require('statuses');

var ResponseBody = ({
    statusCode,
    apiStatus,
    data
}) => {
    statusCode = statusCode || 200;
    var status = httpStatuses(statusCode);
    return ({
        statusCode,
        status,
        apiStatus: apiStatus || status,
        data: data || {}
    });
}

module.exports = ResponseBody;
