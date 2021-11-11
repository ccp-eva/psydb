'use strict';

var StripInternalsStage = (options = {}) => {
    var {
        subChannelKeys = [ 'scientific', 'gdpr' ],
        stripPasswordHash = true,
    } = options;

    var projection = {
        'state.internals': false,
    };
    for (var key of subChannelKeys) {
        projection[`${key}.state.internals`] = false;
    }

    if (!subChannelKeys.includes('gdpr') && stripPasswordHash === true) {
        projection['gdpr.state.internals.passwordHash'] = false;
    }

    return ({ $project: projection })
};

module.exports = StripInternalsStage;
