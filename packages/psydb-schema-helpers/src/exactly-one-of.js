'use strict';
var requireify = require('./requireify');

var exactlyOneOf = (branches) => {
    var augmentedBranches = [];

    for (var current of branches) {
        var excludedKeys = (
            branches
            .filter(other => current !== other)
            .reduce((acc, it) => ([
                ...acc, ...Object.keys(it)
            ]), [])
        );
        var augmented = {
            ...requireify(current),
            propertyNames: { not: { enum: excludedKeys }}
        };

        augmentedBranches.push(augmented);
    }

    return { oneOf: augmentedBranches };
};

module.exports = exactlyOneOf;
