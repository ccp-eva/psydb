'use strict';
var verifyRecordAccess = require('./verify-record-access');

var verifySubjectAccess = async (options) => {
    return await verifyRecordAccess({
        ...options,
        collection: 'subject',
    });
}

module.exports = verifySubjectAccess;
