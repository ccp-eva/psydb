'use strict';
var build_step = require('./build-add-field-definition-step');
var variants = {};

variants['SaneString'] = build_step({
    systemType: 'SaneString',
    definitionOptions: {
        'minLength': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['FullText'] = build_step({
    systemType: 'FullText',
    definitionOptions: {
        'minLength': 0,
        'isSensitive': false
    },
    extraExpectedDefinitionOptions: {}
});

variants['URLString'] = build_step({
    systemType: 'URLString',
    definitionOptions: {
        'minLength': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['Email'] = build_step({
    systemType: 'Email',
    definitionOptions: {
        'minLength': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['Phone'] = build_step({
    systemType: 'Phone',
    definitionOptions: {
        'minLength': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['Integer'] = build_step({
    systemType: 'Integer',
    definitionOptions: {
        'minimum': 0,
        'isNullable': false
    },
    extraExpectedDefinitionOptions: {}
});

variants['DefaultBool'] = build_step({
    systemType: 'DefaultBool',
    definitionOptions: {},
    extraExpectedDefinitionOptions: {}
});

variants['ExtBool'] = build_step({
    systemType: 'ExtBool',
    definitionOptions: {},
    extraExpectedDefinitionOptions: {}
});

variants['BiologicalGender'] = build_step({
    systemType: 'BiologicalGender',
    definitionOptions: {
        'enableUnknownValue': false,
        'enableOtherValue': false
    },
    extraExpectedDefinitionOptions: {}
});

variants['DateTime'] = build_step({
    systemType: 'DateTime',
    definitionOptions: {
        'isSpecialAgeFrameField': false, // subject only
        'isNullable': false
    },
    extraExpectedDefinitionOptions: {}
});

variants['DateOnlyServerSide'] = build_step({
    systemType: 'DateOnlyServerSide',
    definitionOptions: {
        'isSpecialAgeFrameField': false,
        'isNullable': false
    },
    extraExpectedDefinitionOptions: {}
});

variants['ForeignId'] = build_step({
    systemType: 'ForeignId',
    definitionOptions: {
        'collection': undefined,
        'recordType': undefined,
        'constraints': {},
        'isNullable': false,
        'displayEmptyAsUnknown': false,
        'addReferenceToTarget': false
        // targetReferenceField
        // addReferenceToTarget
    },
    extraExpectedDefinitionOptions: {}
});

variants['HelperSetItemId'] = build_step({
    systemType: 'HelperSetItemId',
    definitionOptions: {
        'setId': undefined,
        'isNullable': false,
        'displayEmptyAsUnknown': false
    },
    extraExpectedDefinitionOptions: {}
});


variants['Address'] = build_step({
    systemType: 'Address',
    definitionOptions: {
        'isStreetRequired': false,
        'isHousenumberRequired': false,
        'isAffixRequired': false,
        'isPostcodeRequired': false,
        'isCityRequired': false,
        'isCountryRequired': false
    },
    extraExpectedDefinitionOptions: {}
});

variants['GeoCoords'] = build_step({
    systemType: 'GeoCoords',
    definitionOptions: {},
    extraExpectedDefinitionOptions: {}
});


variants['SaneStringList'] = build_step({
    systemType: 'SaneStringList',
    definitionOptions: {
        'minItems': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['URLStringList'] = build_step({
    systemType: 'URLStringList',
    definitionOptions: {
        'minItems': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['EmailList'] = build_step({
    systemType: 'EmailList',
    definitionOptions: {
        'minItems': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['PhoneList'] = build_step({
    systemType: 'PhoneList',
    definitionOptions: {
        'minItems': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['PhoneWithTypeList'] = build_step({
    systemType: 'PhoneWithTypeList',
    definitionOptions: {
        'minItems': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['ForeignIdList'] = build_step({
    systemType: 'ForeignIdList',
    definitionOptions: {
        'collection': undefined,
        'recordType': undefined,
        'constraints': {},
        'minItems': 0,
        'readOnly': false
    },
    extraExpectedDefinitionOptions: {}
});

variants['HelperSetItemIdList'] = build_step({
    systemType: 'HelperSetItemIdList',
    definitionOptions: {
        'setId': undefined,
        'minItems': 0
    },
    extraExpectedDefinitionOptions: {}
});

variants['ListOfObjects'] = build_step({
    systemType: 'ListOfObjects',
    definitionOptions: {
        'minItems': 0,
        'fields': [
            {
                'key': 'dummySubField',
                'type': 'SaneString',
                'displayName': 'ListOfObjects Sub Dummy',
                'displayNameI18N': { de: 'ListOfObjects Unterfeld Platzhalter' },
                'props': { 'minLength': 0 }
            }
        ]
    },
    extraExpectedDefinitionOptions: {}
});


variants['Lambda'] = build_step({
    systemType: 'Lambda',
    definitionOptions: {
        'fn': 'deltaYMD',
        'input': undefined, // pointer inside record
    },
    extraExpectedDefinitionOptions: {}
});

module.exports = variants;
