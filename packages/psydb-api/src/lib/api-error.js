'use strict';
var StructuredError = require('error').SError,
    getHttpStatus = require('statuses');

class ApiError extends Error {
    constructor (statusCode, apiStatusOrAdditionalProps) {
        var status = getHttpStatus(statusCode).replace(/\s+/, '');

        var apiStatus,
            additionalProps;
        if (typeof apiStatusOrAdditionalProps === 'object') {
            additionalProps = apiStatusOrAdditionalProps;
        }
        else {
            apiStatus = apiStatusOrAdditionalProps;
        }

        apiStatus = apiStatus || status;
        var { metadata, data } = additionalProps || {};

        super(`${apiStatus} : http status = ${statusCode}`);
        this.__info = {
            status,
            statusCode,
            apiStatus,
            metadata,
            data,
        };
    }

    getInfo () {
        return this.__info;
    }
}

module.exports = ApiError;
