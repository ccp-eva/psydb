'use strict';
var mergeRecordLabelProjections = (manyCRTSettings, options = {}) => {
    var { as: projectAs } = options;

    if (!Array.isArray(manyCRTSettings)) {
        manyCRTSettings = Object.values(manyCRTSettings);
    }

    var out = {}
    for (var it of manyCRTSettings) {
        out = {
            ...out,
            ...it.getRecordLabelProjection({ as: projectAs })
        }
    }
    return out;
}

module.exports = mergeRecordLabelProjections;
