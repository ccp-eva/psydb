'use strict';

module.exports = {
    
    Lambda: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: false,
    },

    Integer: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: true,
        searchType: 'Integer',
    },

    Address: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: true,
        searchType: 'SaneString',
    },

    GeoCoords: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: false,
        //searchType: 'SaneString', // TODO: how to search for that?
    },

    EmailList: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: true,
        searchDisplayType: 'SaneString',
    },

    PhoneWithTypeList: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: true,
        searchDisplayType: 'SaneString',
    },

    PhoneList: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: true,
        searchDisplayType: 'SaneString',
    },

    Email: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: true,
        searchDisplayType: 'SaneString',
    },

    FullText: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: true,
        searchType: 'SaneString',
    },

    DateTime: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: false,
        searchType: 'DateTimeInterval',
    },

    DateOnlyServerSide: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: true,
        searchDisplayType: 'SaneString',
        //searchType: 'DateOnlyServerSideInterval',
    },

    ForeignIdList : {
        canBeCustomField: true,
        canBeLabelToken: false,
        canBeDisplayField: true,
        canSearch: true,
        searchDisplayType: 'ForeignId',
    },

    HelperSetItemIdList : {
        canBeCustomField: true,
        canBeLabelToken: false,
        canBeDisplayField: true,
        canSearch: true,
        searchDisplayType: 'HelperSetItemId',
    },

    Id: {
        canBeCustomField: true, // FIXME this is wrong isnt it?
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: false,
    },

    CustomRecordTypeKey : {
        canBeCustomField: false,
        canBeLabelToken: false,
        canBeDisplayField: true,
        canSearch: false,
        searchDisplayType: 'CustomRecordTypeKey',
    },

    PersonnelResearchGroupSettingsList : {
        canBeCustomField: false,
        canBeLabelToken: false,
        canBeDisplayField: true,
        canSearch: false,
    },

    ...[
        'DefaultBool',
        'ExtBool',
        'SaneString',
        'BiologicalGender',
        'ForeignId',
        'HelperSetItemId',
    ].reduce((acc, fieldType) => ({
        ...acc,
        [fieldType]: {
            canBeCustomField: true,
            canBeLabelToken: false,
            canBeDisplayField: true,
            canSearch: true,
        }
    }), {})
}
