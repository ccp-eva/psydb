'use strict';
var Ajv = require('ajv');
var ajvKeywords = require('ajv-keywords');
var psydbFormats = require('@mpieva/psydb-ajv-formats');
var psydbKeywords = require('@mpieva/psydb-ajv-keywords');

var createUnmarshalSchema = require('./create-unmarshal-schema');

var {
    IANAZones,
    getSystemTimezone,
} = require('@mpieva/psydb-timezone-helpers');

var AjvWrapper = (bag = {}) => {
    var {
        disableProhibitedKeyword = false,
        unmarshalClientTimezone, // used to unmarshal date only server side
        formatOverrides = {},
        ...options
    } = bag;

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

    var mergedFormats = { ...psydbFormats, ...formatOverrides };

    ajv.addFormat('email-optional', mergedFormats.emailOptional);
    ajv.addFormat('mongodb-object-id', mergedFormats.mongodbObjectId);
    ajv.addFormat('nanoid-default', mergedFormats.nanoidDefault);
    ajv.addFormat('phone-number', mergedFormats.germanPhoneNumber);
    ajv.addFormat('hex-color', mergedFormats.hexColor);
    ajv.addFormat('time-hm', mergedFormats.timeHM);
    ajv.addFormat('date-only-server-side', mergedFormats.dateOnlyServerSide);
    
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
    ajv.addKeyword(
        'unmarshalMongodbObjectId',
        psydbKeywords.unmarshalMongodbObjectId
    );
    ajv.addKeyword(
        'sanitizeGermanStreetSuffix',
        psydbKeywords.sanitizeGermanStreetSuffix
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

        if (!clientTimezone) {
            clientTimezone = unmarshalClientTimezone;
        }

        wrapper.validateContext = {
            serverTimezone,
            clientTimezone,
        };
    }

    wrapper.validate = (schema, data, options = {}) => {
        resetErrors();

        initializeValidateContext(data);
        var isOK = validate(schema, data);
        if (isOK) {
            isOK = unmarshal(schema, data);
        }
        wrapper.errors = [
            ...wrapper.validateErrors,
            ...wrapper.unmarshalErrors
        ];

        return isOK;
    };

    var validate = (schema, data) => {
        var compiledValidate = ajv.compile(schema);
        var isValid = compiledValidate.call(wrapper.validateContext, data);
        if (!isValid) {
            wrapper.validateErrors = compiledValidate.errors;
        }
        return isValid;
    }

    var unmarshal = (schema, data) => {
        var unmarshalSchema = createUnmarshalSchema(schema);
        var compiledValidate = ajv.compile(unmarshalSchema);
        var isUnmarshaled = compiledValidate.call(wrapper.validateContext, data);
        if (!isUnmarshaled) {
            wrapper.unmarshalErrors = compiledValidate.errors;
        }
        //console.log(data);
        return isUnmarshaled;
    }
    
    var resetErrors = () => {
        wrapper.errors = [];
        wrapper.validateErrors = [];
        wrapper.unmarshalErrors = [];
    }

    return wrapper;
}

module.exports = AjvWrapper;
