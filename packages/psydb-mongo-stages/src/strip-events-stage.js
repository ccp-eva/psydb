'use strict';

var StripEventsStage = (options = {}) => {
    var {
        subChannels, // FIXME: deprecated
        subChannelKeys = [ 'scientific', 'gdpr' ]
    } = options;

    if (subChannels) {
        subChannelKeys = subChannels;
    }

    var projection = {
        _rohrpostMetadata: false,
    };
    for (var key of subChannelKeys) {
        projection[`${key}.rohrpostMetadata`] = false;
    }

    return ({ $project: projection });
};

module.exports = { StripEventsStage }
