'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var hasNoAccessRights = (collection) => {
    return ( ! ([
        'subject',
        'study',
        'location',
        'personnel',
        'externalPerson',
        'externalOrganization',
    ].includes(collection)));
}

var collectionHasSubChannels = (collection) => {
    return allSchemaCreators[collection].hasSubChannels
}

module.exports = {
    hasNoAccessRights,
    collectionHasSubChannels
}
