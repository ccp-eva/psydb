'use strict';

module.exports = {
    
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
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: false,
    },

    ...[
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
