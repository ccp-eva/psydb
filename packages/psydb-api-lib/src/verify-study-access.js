'use strict';
var verifyRecordAccess = require('./verify-record-access');

var verifyStudyAccess = async (options) => {
    return await verifyRecordAccess({
        ...options,
        recordIds: options.studyIds,
        recordId: options.studyId,
        collection: 'study',
    });
}

module.exports = verifyStudyAccess;
