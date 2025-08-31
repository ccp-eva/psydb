'use strict';
var { DriverError, RequestError, ApiError } = require('./errors');

var handleError = (e) => {
    if (e.response) {
        if (e.response.data?.apiStatus) {
            throw ApiError.fromResponse(e.response);
        }
        else {
            throw RequestError.fromRespone(e.response);
        }
    }
    else {
        throw e;
    }
}

module.exports = handleError;
