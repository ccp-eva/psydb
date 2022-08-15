'use strict';
var inline = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createPermissionCheckStages = (bag) => {
    var { permissions, collection } = bag;
    console.log(collection);

    if (permissions.isRoot()) {
        return [];
    }

    // NOTE: we have collections that do not have
    // record based systempermissions but instead
    // only require collection access
    if (hasNoAccessRights(collection)) {
        return [];
    }

    var allowedResearchGroupIds = (
        permissions.getCollectionFlagIds(collection, 'read')
    );
    
    var statePath = (
        collectionHasSubChannels(collection)
        ? 'scientific.state'
        : 'state'
    );
    console.log(statePath);

    var fullPath = inline`
        ${statePath}
        .systemPermissions
        .accessRightsByResearchGroup
        .researchGroupId
    `;

    var stages = [
        { $match: {
            [fullPath]: { $in: (
                permissions.getCollectionFlagIds(collection, 'read')
            )}
        }}
    ];

    console.log(stages);
    return stages;
}

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

module.exports = createPermissionCheckStages;
