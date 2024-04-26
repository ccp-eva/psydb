'use strict';
var dataSchemas = require('@mpieva/psydb-schema-fields');
var defnitionSchemas = require('../field-definition-schemas');

var availableSystemTypes = [
    'SaneString',
    'FullText',
    'Integer',
    
    'ForeignId',
    'HelperSetItemId',

    'DateTime',
    'DateOnlyServerSide',
    'BiologicalGender',
    'DefaultBool',
    'ExtBool',
    'Email',
    'Phone',

    'Address',
    'GeoCoords',

    'URLStringList',
    'SaneStringList',
    'EmailList',
    'PhoneWithTypeList',
    'PhoneList',
    'ForeignIdList',
    'HelperSetItemIdList',
    
    'ListOfObject',
    'Lambda',
];

var FieldDefinition = (bag) => {
    var { data } = bag;
    var { systemType } = data;

    var that = {};
    that.getDefinitionSchema = (...args) => (
        definitionSchemas[systemType](...args)
    );
    that.getDataSchema = (...args) => (
        dataSchemas[systemType](...args)
    );

    // stringifyData = (data) => {}
    

    /////////////////
    
    that.getCSVColumnKeys = () => {
        var { csvColumnKey, key } = data;
        
        if (csvColumnKey) {
            return [ csvColumnKey ];
        }
        
        if (systemType === 'Lambda') {
            return undefined; // NOTE: skip
        }

        if (systemType === 'Address') {
            return [
                `${key}.country`,
                `${key}.city`,
                `${key}.postcode`,
                `${key}.street`,
                `${key}.housenumber`,
                `${key}.affix`,
            ];
        }
        else if (systemType === 'GeoCoords') {
            return [
                `${key}.latitude`,
                `${key}.longitude`,
            ];
        }
        else {
            return [ key ];
        }
    }

    // FIXME: i dont like that
    that.getRequiredCSVColumnKeys = () => {
        var { csvColumnKey, key, props = {} } = data;
        var { minLength, minItems, isNullable } = props;

        csvColumnKey = csvColumnKey || key;

        if (systemType === 'Lambda') {
            return undefined; // NOTE: skip
        }

        if (minLength > 0 || minItems > 0) {
            return [ csvColumnKey ]
        }

        if ([ 'BiologicalGender' ].includes(systemType)) {
            return [ csvColumnKey ]
        }
        
        if ([
            'ForeignId',
            'HelperSetItem',
            'DateOnlyServerSide',
            'DateTime',
            'Integer',
        ].includes(systemType) && !isNullable) {
            return [ csvColumnKey ];
        }

        if (systemType === 'Address') {
            var out = [];
            if (props.isCountryRequired) {
                out.push(`${key}.country`);
            }
            if (props.isCityRequired) {
                out.push(`${key}.city`);
            }
            if (props.isPostcodeRequired) {
                out.push(`${key}.postcode`);
            }
            if (props.isStreetRequired) {
                out.push(`${key}.street`);
            }
            if (props.isHousenumberRequired) {
                out.push(`${key}.housenumber`);
            }
            if (props.isAffixRequired) {
                out.push(`${key}.affix`);
            }
            return out;
        }
        
        if (systemType === 'GeoCoords') {
            return [ `${key}.latitude`, `${key}.longitude`]
        }
    }

    return that;
}

module.exports = FieldDefinition;
