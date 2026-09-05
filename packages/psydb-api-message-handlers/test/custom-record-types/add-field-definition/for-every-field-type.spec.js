'use strict';
var snake = require('just-snake-case');
var { FieldDefinitionSchemas } = require('@mpieva/psydb-common-lib');
var { INIT_STEP_BAG } = require('./init');
var { CRT, HELPER_SET } = require('./steps');

describe('custom-record-types/add-field-definition', function () {
    before(INIT_STEP_BAG());

    HELPER_SET.create('acquisition');
    HELPER_SET('acquisition').createItem('shelter');

    CRT.create('location', 'cat_shelter');
    CRT.create('subject', 'cat_owner');
    CRT.create('subject', 'cat');
    
    for (var systemType of [
        'SaneString',
        'FullText',
        'URLString',
        'Email',
        'Phone',
        'Integer',
        'DefaultBool',
        'ExtBool',
        'BiologicalGender',
        'DateTime',
        'DateOnlyServerSide',
        'Address',
        'GeoCoords',
        'SaneStringList',
        'URLStringList',
        'EmailList',
        'PhoneList',
        'PhoneWithTypeList',
    ]) {
        CRT('cat').addFieldDefinition({
            systemType: systemType,
            fieldKey: snake(systemType), subChannelKey: 'scientific',
        });
    }

    CRT('cat').addFieldDefinition({
        systemType: 'ForeignId',
        fieldKey: snake('ForeignId'), subChannelKey: 'scientific',
        overrides: {
            '/props/props/collection': 'subject',
            '/props/props/recordType': 'cat_shelter'
        }
    });

    CRT('cat').addFieldDefinition({
        systemType: 'ForeignIdList',
        fieldKey: snake('ForeignIdList'), subChannelKey: 'scientific',
        overrides: {
            '/props/props/collection': 'subject',
            '/props/props/recordType': 'cat_owner'
        }
    });

    CRT('cat').addFieldDefinition({
        systemType: 'HelperSetItemId',
        fieldKey: snake('HelperSetItemId'), subChannelKey: 'scientific',
        overrides: ({ cachedIds }) => ({
            '/props/props/setId': cachedIds.helperSet['acquisition']
        })
    });
    
    CRT('cat').addFieldDefinition({
        systemType: 'HelperSetItemIdList',
        fieldKey: snake('HelperSetItemIdList'), subChannelKey: 'scientific',
        overrides: ({ cachedIds }) => ({
            '/props/props/setId': cachedIds.helperSet['acquisition']
        })
    });

    CRT('cat').addFieldDefinition({
        systemType: 'ListOfObjects',
        fieldKey: snake('ListOfObjects'), subChannelKey: 'scientific',
        overrides: {
            '/props/props/fields': [
                {
                    'key': 'item_label',
                    'type': 'SaneString',
                    'displayName': 'Label',
                    'displayNameI18N': { de: 'Bezeichnung' },
                    'props': { minLength: 1 }
                },
                {
                    'key': 'item_value',
                    'type': 'SaneString',
                    'displayName': 'Value',
                    'displayNameI18N': { de: 'Wert' },
                    'props': { minLength: 1 }
                }
            ]
        }
    });

    //CRT('cat').createRecord([
    //    { subChannel: 'scientific', data: {
    //        'custom': {},
    //        'comment': '',
    //        'testingPermissions': [],
    //        'systemPermissions': {
    //            'isHidden': false,
    //            'accessRightsByResearchGroup': []
    //        }
    //    }},
    //    { subChannel: 'gdpr', data: {
    //        // NONE
    //    }}
    //], { as: 'tabby' });
})
