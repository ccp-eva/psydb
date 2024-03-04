'use strict';
var { entries, convertPointerToPath } = require('@mpieva/psydb-core-utils');

var MatchConstraintsStage = (bag) => {
    var {
        constraints,
        __sanitize_$in = false, // TODO: reomve, included for safety reasons
    } = bag;

    if (__sanitize_$in) {
        // FIXME: thats a hotfixed for non-$in arrays in constraint values
        constraints = entries(constraints).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: Array.isArray(value) ? { $in: value } : value
        }), {});
    }

    var stage = (
        { $match: {
            ...Object.keys(constraints).reduce((acc, pointer) => {
                var mongoPath = convertPointerToPath(pointer);
                return {
                    ...acc,
                    [mongoPath]: constraints[pointer],
                }
            }, {})
        }}
    );

    return stage;
}

module.exports = MatchConstraintsStage;
