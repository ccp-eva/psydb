'use strict';
var CustomTypeCollectionEnum = () => ({
    type: 'string',
    enum: [
        'location',
        'subject',
        'study',
        'externalPerson',
        'externalOrganization',
    ]
});

module.exports = CustomTypeCollectionEnum;
