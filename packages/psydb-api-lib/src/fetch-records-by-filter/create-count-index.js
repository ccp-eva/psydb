'use strict';
var inline = require('@cdxoo/inline-string');

var {
    hasNoAccessRights,
    collectionHasSubChannels
} = require('./utils');


var createCountIndex = async (bag) => {
    var { db, collection } = bag;

    var statePath = (
        collectionHasSubChannels(collection)
        ? 'scientific.state'
        : 'state'
    );

    var cindex = {
        type: 1,
        isDummy: 1,
        [`${statePath}.internals.isRemoved`]: 1,
        [`${statePath}.systemPermissions.isHidden`]: 1
    }

    if (!hasNoAccessRights) {
        var key = inline`
            ${statePath}
            .systemPermissions
            .accessRightsByResearchGroup
            .researchGroupId
        `;
        cindex[key] = 1;
    }

    await db.collection(collection).ensureIndex(cindex, {
        name: 'countIndex1'
    });
}

module.exports = createCountIndex;
