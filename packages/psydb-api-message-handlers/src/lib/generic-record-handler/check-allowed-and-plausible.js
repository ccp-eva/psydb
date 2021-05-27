'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var parseRecordMessageType = require('./parse-record-message-type');

var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions,
}) => {
    var { type: messageType, payload } = message;

    var { 
        op, collection, 
        recordType, recordSubType 
    } = parseRecordMessageType(messageType);

    if (op === 'create') {
        if (!permissions.hasRootAccess) {
            throw new ApiError(403);
        }
    }
    else if (op === 'patch') {
        var record = await (
            db.collection(collection).findOne({ _id: payload.id })
        );
        if (!record) {
            throw new ApiError(400);
        }
        if (!permissions.hasRootAccess) {
            throw new ApiError(403);
        }
    }
    // TODO: deleteGdpr
    else {
        // unknown op
        throw new ApiError(400); // TODO 
    }
}

module.exports = checkAllowedAndPlausible;
