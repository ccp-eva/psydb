'use strict';
var QuickSearchStages = require('./quick-search-stages');
var MatchConstraintsStage = require('./match-constraints-stage');
var PaginationStages = require('./pagination-stages');

var isNotDummyStage = () => (
    { $match: {
        isDummy: { $ne: true }
    }}
)

var isNotRemovedStage = (bag = {}) => {
    var { hasSubChannels = false } = bag;
    var path = (
        hasSubChannels
        ? 'scientific.state.internals.isRemoved'
        : 'state.internals.isRemoved'
    );

    return { $match: {
        [path]: { $ne: true }
    }};
}

var isNotHiddenStage = (bag = {}) => {
    var { hasSubChannels = false } = bag;
    var path = (
        hasSubChannels
        ? 'scientific.state.systemPermissions.isHidden'
        : 'state.systemPermissions.isHidden'
    );

    return { $match: {
        [path]: { $ne: true }
    }};
}

var StripRohrpostMetadataStage = (bag = {}) => {
    var { hasSubChannels = false } = bag;
    // TODO: subChannnels
    return (
        { $project: {
            _rohrpostMetadata: false
        }}
    )
}

module.exports = {
    QuickSearchStages,
    MatchConstraintsStage,
    PaginationStages,

    isNotDummyStage,
    isNotRemovedStage,
    isNotHiddenStage,

    StripRohrpostMetadataStage
}

