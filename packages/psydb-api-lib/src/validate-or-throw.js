'use strict';
var debug = require('debug')('psydb:api-lib:validateOrThrow');
var { inspect } = require('util');

var { copy } = require('@mpieva/psydb-core-utils');
var Ajv = require('./ajv');
var ApiError = require('./api-error');

var validateOrThrow = (bag) => {
    var {
        payload,
        schema,
        apiStatus = 'InvalidRequestSchema',
        //performUnmarshal = true,
        performClone = false,

        unmarshalClientTimezone, // TODO deprecate
        i18n,
    } = bag;

    if (i18n) {
        unmarshalClientTimezone = i18n.timezone;
    }

    if (performClone) {
        payload = copy(payload);
    }

    var ajv = Ajv({ unmarshalClientTimezone });
    var isValid = false;

    isValid = ajv.validate(
        schema,
        payload
    );
    if (!isValid) {
        debug('ajv errors');
        debug(inspect(ajv.errors, { depth: null }));
        throw new ApiError(400, {
            apiStatus,
            data: { ajvErrors: ajv.errors }
        });
    };
    
    return payload;
}

validateOrThrow.lambda = (bag) => (other) => (
    validateOrThrow({ ...bag, ...other })
)

module.exports = validateOrThrow
