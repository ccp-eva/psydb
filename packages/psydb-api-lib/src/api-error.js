'use strict';
var { VerifyError } = require('@mpieva/psydb-common-verify-helpers');
var getHttpStatus = require('./psydb-http-statuses');

class ApiError extends Error {
    constructor (statusCode, apiStatusOrAdditionalProps) {
        var status = getHttpStatus(statusCode).replace(/\s+/g, '');

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

ApiError.from = (statusCode, otherError) => {
    if (otherError instanceof VerifyError) {
        var info = otherError.getInfo();
        return new ApiError(statusCode, {
            apiStatus: info.status,
            data: info.status
        });
    }
    else {
        throw new Error('unknown error type');
    }
}

module.exports = ApiError;
