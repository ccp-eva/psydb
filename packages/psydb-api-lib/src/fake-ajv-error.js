'use strict';
var convertPointerToPath = require('./convert-pointer-to-path');

var FakeAjvError = (bag) => {
    var {
        dataPath,
        error,
        extraParams = {}
    } = bag;

    var {
        message = error.message,
        errorClass = error.constructor.name,
    } = bag;

    // ajv 6 compat
    dataPath = '.' + convertPointerToPath(dataPath);

    return {
        dataPath,
        keyword: 'FakeAjvError',
        message,
        params: {
            errorClass,
            ...extraParams,
        }
    }
}

module.exports = FakeAjvError;
