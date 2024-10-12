'use strict';
var Fields = require('./fields');

var createMatchStages = (bag) => {
    var { from, type } = bag;

    var stages = [];
    for (var it of from) {
        var { definition, input } = it;
        var systemType = definition.systemType || definition.type; // FIXME

        if (input !== undefined) {
            stages.push({ $match: (
                Fields[systemType].createQueryFilter({
                    type, definition, input
                })
            )})
        }
    }

    return stages;
}

module.exports = createMatchStages;
