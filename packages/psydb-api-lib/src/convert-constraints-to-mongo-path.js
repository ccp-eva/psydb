'use strict';
var convertPointerToPath = require('./convert-pointer-to-path');

var convertConstraintsToMongoPath = (constraints, options) => {
    options = options || {};
    console.log(constraints);
    if (constraints === undefined) {
        return {};
    }

    var prefix = options.prefix || '';
    var converted = {};
    for (var pointer of Object.keys(constraints)) {
        var key = prefix + convertPointerToPath(pointer);
        converted[key] = constraints[pointer];
    }

    return converted;
}

module.exports = convertConstraintsToMongoPath;
