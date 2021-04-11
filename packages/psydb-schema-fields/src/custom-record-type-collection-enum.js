'use strict';
var CustomRecordTypeCollectionEnum = ({ ...additionalProps }) => ({
    type: 'string',
    enum: [
        'location',
        'subject',
        'study',
        'externalPerson',
        'externalOrganization',
    ],
    ...additionalProps,
});

module.exports = CustomRecordTypeCollectionEnum;
