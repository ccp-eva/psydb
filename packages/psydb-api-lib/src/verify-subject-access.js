'use strict';
var verifyRecordAccess = require('./verify-record-access');

var verifySubjectAccess = async (options) => {
    return await verifyRecordAccess({
        ...options,
        recordIds: options.subjectIds,
        recordId: options.subjectId,
        collection: 'subject',
    });
}

module.exports = verifySubjectAccess;
