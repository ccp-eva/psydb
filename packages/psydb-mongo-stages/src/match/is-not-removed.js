'use strict';

var isNotRemoved = (bag = {}) => {
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

module.exports = isNotRemoved;
