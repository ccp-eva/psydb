'use strict';

module.exports = {
    
    Address: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: true,
        searchType: 'SaneString',
    },

    EmailList: {
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
