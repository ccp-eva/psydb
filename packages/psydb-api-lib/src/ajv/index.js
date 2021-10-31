'use strict';
var Ajv = require('ajv'),
    ajvKeywords = require('ajv-keywords'),
    psydbFormats = require('@mpieva/psydb-ajv-formats'),
    psydbKeywords = require('@mpieva/psydb-ajv-keywords');

var {
    IANAZones,
    getSystemTimezone,
} = require('@mpieva/psydb-timezone-helpers');

var AjvWrapper = ({
    disableProhibitedKeyword = false,
    ...options
} = {}) => {

    var wrapper = {
        errors: [],
        validateContext: {},
    };

    var ajv = new Ajv({
        $data: true,
        allErrors: true,
        //strictDefaults: 'log',
        //strictKeywords: 'log',
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
    ajv.addFormat('hex-color', psydbFormats.hexColor);
    
    ajvKeywords(ajv, [
        'uniqueItemProperties',
        'transform', // to trim strings
        ...(
            !disableProhibitedKeyword
            ? [ 'prohibited' ] // to protect internals property
            : []
        ),
    ]);

    //ajv.addKeyword('foreignKey', psydbKeywords.foreignKey);
    ajv.addKeyword('unmarshalDateTime', psydbKeywords.unmarshalDateTime);
    ajv.addKeyword(
        'unmarshalDateOnlyServerSide',
        psydbKeywords.unmarshalDateOnlyServerSide
    );

    var initializeValidateContext = (data) => {
        var serverTimezone = getSystemTimezone();
        var clientTimezone = undefined;

        // FIXME: relying on data here is quite hacky
        // on the other hand it will be caught in validator
        // later when its invalid; we just need to make sure we dont
        // rely on it being set in the keywords using clientTimezoneOffset
        if (IANAZones.includes(data.timezone)) {
            clientTimezone = data.timezone;
        }

        wrapper.validateContext = {
            serverTimezone,
            clientTimezone,
        };
    }

    wrapper.validate = (schema, data) => {
        var compiledValidate = ajv.compile(schema);
        
        initializeValidateContext(data);
        var isValid = compiledValidate.call(wrapper.validateContext, data);

        wrapper.errors = compiledValidate.errors;

        return isValid;
    };

    return wrapper;
}

module.exports = AjvWrapper;
