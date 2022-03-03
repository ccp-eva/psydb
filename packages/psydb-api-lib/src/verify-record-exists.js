'use strict';
var ApiError = require('./api-error');

var verifyRecordExists = async (options) => {
    var { db, collection, recordId } = options;

    var record = await (
        db.collection(collection)
        .findOne({ _id: recordId }, { projection: { _id: true }})
    );

    if (!record) {
        throw new ApiError(404, {
            apiStatus: 'RecordNotFound',
            data: { collection, id: recordId }
        });
    }
}

module.exports = verifyRecordExists;
