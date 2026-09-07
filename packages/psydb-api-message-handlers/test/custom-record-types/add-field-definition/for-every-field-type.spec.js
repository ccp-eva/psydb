'use strict';
var snake = require('just-snake-case');
var { INIT_STEP_BAG } = require('./init');
var { CRT, HELPER_SET, RESEARCH_GROUP, SUBJECT } = require('./steps');

describe('custom-record-types/add-field-definition', function () {
    before(INIT_STEP_BAG({ trackedCollections: [
        'crt', 'helperSet', 'helperSetItem', 'researchGroup', 'subject'
    ]}));

    HELPER_SET.create('acquisition');
    HELPER_SET('acquisition').createItem('shelter');
    HELPER_SET('acquisition').createItem('website');
    HELPER_SET('acquisition').createItem('newsletter');

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
            '/props/props/recordType': 'cat_shelter',
            '/props/props/isNullable': true,
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

    CRT('cat').commitSettings();

    //RECORD.create('researchGroup', {}, { as: 'cat_group' });
    //RESEARCH_GROUP.create({}, { as: 'cat_group' });
    RESEARCH_GROUP.create('cat_group');

    //RECORD.create('subject', 'cat', [], { as: 'tabby' });
    //CRT('cat').createRecord([], { as: 'tabby' });

    SUBJECT.create('cat', ({ cachedIds }) => ([
        { subChannel: 'scientific', data: {
            'custom': {
                'sane_string': 'SANE_STRING',
                'full_text': "FULL_TEXT\nFULL_TEXT",
                'u_r_l_string': 'http://url.string',
                'email': 'email@example.com',
                'phone': '0123/4567890',
                'integer': 42,
                'default_bool': true,
                'ext_bool': 'yes',
                'biological_gender': 'female',
                'date_time': new Date('1999-12-12T12:00:00.000Z'),
                'date_only_server_side': new Date('2001-01-01T00:00:00.000Z'),
                'address': {
                    'country': 'DE',
                    'city': 'CITY',
                    'postcode': '12345',
                    'street': 'STREET',
                    'housenumber': '12',
                    'affix': 'AF'
                },
                'geo_coords': { 'latitude': 42.0, 'longitude': 43.0 },
                'sane_string_list': [
                    'SANE_STRING_0',
                    'SANE_STRING_1',
                ],
                'u_r_l_string_list': [
                    'http://url_0.string',
                    'http://url_1.string',
                ],
                'email_list': [
                    { email: 'email_0@example.com', isPrimary: true },
                    { email: 'email_1@example.com', isPrimary: false },
                ],
                'phone_list': [
                    '0234/5678901',
                    '0345/6789012',
                ],
                'phone_with_type_list': [
                    { 'number': '0456/7890123', 'type': 'private' },
                    { 'number': '0567/8901234', 'type': 'business' },
                ],
                // TODO
                'foreign_id': null,
                'foreign_id_list': [],
                //
                'helper_set_item_id': cachedIds.helperSetItem['shelter'],
                'helper_set_item_id_list': [
                    cachedIds.helperSetItem['website'],
                    cachedIds.helperSetItem['newsletter'],
                ],
                'list_of_objects': [
                    { item_label: 'LABEL_0', item_value: 'VALUE_0' },
                    { item_label: 'LABEL_1', item_value: 'VALUE_1' },
                ]
            },
            'comment': "COMMENT\nCOMMENT",
            'testingPermissions': [],
            'systemPermissions': {
                'isHidden': false,
                'accessRightsByResearchGroup': [{
                    researchGroupId: cachedIds.researchGroup['cat_group'],
                    permission: 'write'
                }]
            }
        }},
        { subChannel: 'gdpr', data: {
            custom: {}, // FIXME
        }}
    ]), { as: 'tabby' });

})
