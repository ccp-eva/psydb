'use strict';
module.exports = {
    
    Address: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: true,
        searchType: 'SaneString',

        stringify: (value) => (
            [
                value.street,
                value.housenumber,
                value.affix,
                value.postcode,
                value.city,
                // omitting country here,
            ]
            .filter(it => !!it)
            .join(' ')
        ),
    },

    EmailList: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: true,
        searchType: 'Email',

        stringify: (value) => (value.join(', ')),
        // TODO: decide if we want to separate stringify stuff into
        // label/display
    },

    PhoneList: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: false,
        canSearch: true,
        searchType: 'Phone',
        
        stringify: (value) => (value.join(', ')),
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
        canSearch: true,
        searchType: 'DateTimeInterval'
    },

    //BiologicalGender,

    DateOnlyServerSide: {
        canBeCustomField: true,
        canBeDisplayField: true,
        canBeLabelField: true,
        canSearch: true,
        searchType: 'DateOnlyServerSideInterval'
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
        'ForeignIdList',
        'HelperSetItemId',
        'HelperSetItemIdList',
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
