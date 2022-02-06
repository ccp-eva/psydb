'use strict';
var convertPointerToPath = require('./convert-pointer-to-path');

var FakeAjvError = ({ dataPath, error, extraParams = {} }) => {
    // ajv 6 compat
    dataPath = convertPointerToPath(dataPath);

    return {
        dataPath,
        keyword: 'FakeAjvError',
        message: error.message,
        params: {
            errorClass: error.constructor.name,
            ...extraParams,
        }
    }
}

module.exports = FakeAjvError;
