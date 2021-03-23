'use strict';
var getHttpStatus = require('statuses');

class ApiError extends Error {
    constructor (statusCode, apiStatusOrAdditionalProps) {
        var status = getHttpStatus(statusCode).replace(/\s+/, '');

        var apiStatus,
            additionalProps,
            data,
            rest;
        if (typeof apiStatusOrAdditionalProps === 'object') {
            additionalProps = apiStatusOrAdditionalProps;
            ({ apiStatus, data, ...rest } = additionalProps || {})
        }
        else {
            apiStatus = apiStatusOrAdditionalProps;
        }

        apiStatus = apiStatus || status;

        super(`${apiStatus} : http status = ${statusCode} ${status}`);
        this.__info = {
            status,
            statusCode,
            apiStatus,
            data,
        };
    }

    getInfo () {
        return this.__info;
    }
}

module.exports = ApiError;
