'use strict';
var debug = require('debug')('psydb:api-lib:validateOrThrow');

var Ajv = require('./ajv');
var ApiError = require('./api-error');

var validateOrThrow = ({ payload, schema }) => {
    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        schema,
        payload
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidRequestSchema',
            data: { ajvErrors: ajv.errors }
        });
    };
}

module.exports = validateOrThrow
