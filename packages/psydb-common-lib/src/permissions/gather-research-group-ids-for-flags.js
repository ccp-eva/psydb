'use strict';
var { flatten, unflatten } = require('flat');

var gatherResearchGroupIdsForFlags = (options) => {
    var {
        researchGroupIds,
        flagsByResearchGroupId,
    } = options;

    var gathered = {};
    for (var gid of researchGroupIds) {
        var flags = flatten(flagsByResearchGroupId[gid]);
        for (var path of Object.keys(flags)) {
            if (flags[path] === true) {
                if (!gathered[path]) {
                    gathered[path] = [];
                }
                gathered[path].push(gid);
            }
        }
    }

    return unflatten(gathered);
}

module.exports = { gatherResearchGroupIdsForFlags };
