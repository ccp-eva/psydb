'use strict';
class VerifyError extends Error {
    constructor (status, data) {
        super(`VerifyError: ${status}`);
        this.__info = {
            status,
            data
        }
    }
    getInfo () {
        return this.__info;
    }
}

module.exports = VerifyError;
