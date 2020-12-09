'use strict';
var Ajv = require('ajv'),
    ajvKeywords = require('ajv-keywords'),
    psydbFormats = require('@mpieva/psydb-ajv-formats'),
    psydbKeywords = require('@mpieva/psydb-ajv-keywords');

var createAjvMiddleware = () => async (context, next) => {
    var ajv = new Ajv({
        allErrors: true,
        useDefaults: true,
    });

    ajv.addFormat('mongodb-object-id', psydbFormats.mongodbObjectId);
    ajv.addFormat('phone-number', psydbFormats.germanPhoneNumber);

    context.ajv = ajv;

    await next();
}

module.exports = createAjvMiddleware;
