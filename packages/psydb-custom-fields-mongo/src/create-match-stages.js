'use strict';
var { __fixDefinitions } = require('@mpieva/psydb-common-compat');
var Fields = require('./fields');

var createMatchStages = (bag) => {
    var { from, type } = bag;

    var stages = [];
    for (var it of from) {
        var { definition, input } = it;
        ([ definition ] = __fixDefinitions([ definition ])); // FIXME

        var { systemType } = definition;

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
