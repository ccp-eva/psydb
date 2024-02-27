'use strict';
var debug = require('debug')('psydb:api-lib:two-factor-authentication');
var withRetracedErrors = require('../with-retraced-errors');

var removeCode = async (bag) => {
    var { db, personnelId } = bag;
    
    await withRetracedErrors(
        db.collection('twoFactorAuthCodes').deleteOne(
            { personnelId },
        )
    );
}

module.exports = removeCode;
