'use strict';
var convertPointerToPath = require('../convert-pointer-to-path');

var MatchConstraintsStage = ({
    constraints
}) => {
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
