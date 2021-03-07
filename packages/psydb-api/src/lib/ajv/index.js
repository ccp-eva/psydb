'use strict';
var Ajv = require('ajv'),
    ajvKeywords = require('ajv-keywords'),
    psydbFormats = require('@mpieva/psydb-ajv-formats'),
    psydbKeywords = require('@mpieva/psydb-ajv-keywords');

var AjvWrapper = ({
    disableProhibitedKeyword = false,
    ...options
} = {}) => {

    var wrapper = {
        errors: [],
        validateContext: {},
    };

    var ajv = new Ajv({
        allErrors: true,
        strictDefaults: 'log',
        strictKeywords: 'log',
        passContext: true,
        // NOTE: useDefauls applies to missing _required_ properties
        // what we actually wanted was it being applied to _optional_
        // values
        //useDefaults: true,
        // TODO: 'all' vs 'failing'; can we error out?
        // TODO: when sending additional we want to error out
        //removeAdditional: true,

        ...options,
    });

    ajv.addFormat('mongodb-object-id', psydbFormats.mongodbObjectId);
    ajv.addFormat('nanoid-default', psydbFormats.nanoidDefault);
    ajv.addFormat('phone-number', psydbFormats.germanPhoneNumber);
    
    ajvKeywords(ajv, [
        'uniqueItemProperties',
        'transform', // to trim strings
        ...(
            !disableProhibitedKeyword
            ? [ 'prohibited' ] // to protect internals property
            : []
        ),
    ]);

    ajv.addKeyword('foreignKey', psydbKeywords.foreignKey);

    var initializeValidateContext = () => {
        wrapper.validateContext = {};
    }

    wrapper.validate = (schema, data) => {
        var compiledValidate = ajv.compile(schema);
        
        initializeValidateContext();
        var isValid = compiledValidate.call(wrapper.validateContext, data);

        wrapper.errors = ajv.errors;

        return isValid;
    };

    return wrapper;
}

module.exports = AjvWrapper;
