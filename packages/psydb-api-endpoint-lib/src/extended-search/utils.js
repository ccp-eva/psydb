'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var { Fields } = require('@mpieva/psydb-custom-fields-mongo');

var createCustomQueryValues = (options) => {
    var { fields, filters: inputs } = options;

    var combined = {};
    for (var definition of fields) {
        var { type, key } = definition;
        var input = inputs[key];

        if (!input) {
            continue;
        }

        var filter = Fields[type].createQueryFilter({
            type: 'extended-search', definition, input
        });
        if (filter) {
            Object.assign(combined, filter);
        }
    }

    //console.log(combined);
    return combined;
}

var convertPointerKeys = (obj) => {
    var converted = Object.keys(obj).reduce((acc, key) => ({
        ...acc,
        [ convertPointerToPath(key) ]: obj[key],
    }), {});

    return converted;
}


module.exports = {
    createCustomQueryValues,
    convertPointerKeys,
    makeRX,
    escapeRX, // FIXME: use make RX
}
