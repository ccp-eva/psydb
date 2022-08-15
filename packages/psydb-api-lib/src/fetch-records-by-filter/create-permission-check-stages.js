'use strict';
var inline = require('@cdxoo/inline-string');

var {
    hasNoAccessRights,
    collectionHasSubChannels
} = require('./utils');


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

    return stages;
}


module.exports = createPermissionCheckStages;
