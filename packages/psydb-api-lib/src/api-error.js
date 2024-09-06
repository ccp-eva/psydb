'use strict';
var debug = require('debug')('psydb-api-lib:api-error');

var { inspect } = require('util');
var { ejson } = require('@mpieva/psydb-core-utils');
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
            ...rest,
            status,
            statusCode,
            apiStatus,
            data,
        };

        debug('ApiError', inspect(ejson(this.__info), { depth: null }));
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
        throw otherError;
    }
}

module.exports = ApiError;
