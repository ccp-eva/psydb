'use strict';

var createCRTCollectionStages = require('./create-crt-collection-stages');

var isNotDummyStage = () => (
    { $match: {
        isDummy: { $ne: true }
    }}
)

var isNotRemovedStage = ({ hasSubChannels }) => {
    var path = (
        hasSubChannels
        ? 'scientific.state.internals.isRemoved'
        : 'state.internals.isRemoved'
    );

    return { $match: {
        [path]: { $ne: true }
    }};
}

var isNotHiddenStage = ({ hasSubChannels }) => {
    var path = (
        hasSubChannels
        ? 'scientific.state.systemPermissions.isHidden'
        : 'state.systemPermissions.isHidden'
    );

    return { $match: {
        [path]: { $ne: true }
    }};
}

module.exports = {
    createCRTCollectionStages,
    isNotDummyStage,
    isNotRemovedStage,
    isNotHiddenStage
}
