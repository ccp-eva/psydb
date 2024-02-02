'use strict';
var debug = require('debug')('psydb:api-lib:two-factor-authentication');
var withRetracedErrors = require('../with-retraced-errors');

var matchExistingCode = async (bag) => {
    var { db, personnelId, inputCode } = bag;

    var codeRecord = await withRetracedErrors(
        db.collection('twoFactorAuthCodes').findOne(
            { personnelId },
        )
    );

    var out = { exists: false };
    if (codeRecord) {
        out.exists = true;
        if (inputCode) {
            out.matches = (inputCode === codeRecord.code);
        }
    }
    return out;
}

module.exports = matchExistingCode;
