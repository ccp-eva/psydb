'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var { Fields } = require('@mpieva/psydb-custom-fields-mongo');

var createCustomFieldMatchStages = (options) => {
    var { definitions, inputs } = options;

    var stages = [];
    for (var definition of definitions) {
        var systemType = definition.systemType || definition.type; // FIXME
        var input = inputs[definition.key];

        if (!input) {
            continue;
        }

        var filter = Fields[systemType].createQueryFilter({
            type: 'extended-search', definition, input
        });
        if (filter) {
            stages.push({ $match: filter });
        }
    }

    return stages;
}

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
    createCustomFieldMatchStages,
    createCustomQueryValues,
    convertPointerKeys,
}
