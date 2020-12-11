'use strict';
var Ajv = require('ajv'),
    ajvKeywords = require('ajv-keywords'),
    psydbFormats = require('@mpieva/psydb-ajv-formats'),
    psydbKeywords = require('@mpieva/psydb-ajv-keywords');

var AjvWrapper = ({
    ...options
}) => {
    var ajv = new Ajv({
        allErrors: true,
        strictDefaults: 'log',
        strictKeywords: 'log',
        // NOTE: useDefauls applies to missing _required_ properties
        // what we actually wanted was it being applied to _optional_
        // values
        //useDefaults: true,
        // TODO: 'all' vs 'failing'; can we error out?
        removeAdditional: true,

        ...options,
    });

    ajv.addFormat('mongodb-object-id', psydbFormats.mongodbObjectId);
    ajv.addFormat('phone-number', psydbFormats.germanPhoneNumber);
    
    ajvKeywords(ajv, [
        'uniqueItemProperties',
        'prohibited', // to protect internals property
        'transform', // to trim strings
    ]);

    return ajv;
}

module.exports = AjvWrapper;
