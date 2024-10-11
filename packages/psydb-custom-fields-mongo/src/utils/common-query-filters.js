'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var { makeDiaRX } = require('@mpieva/psydb-common-lib');

var JustRegex = (pointer, input) => {
    var path = convertPointerToPath(pointer);
    return (
        input
        ? { [path]: makeDiaRX(input) }
        : undefined
    )
};

var MultiRegex = (pointer, input, keys) => {
    input = input || {};
    var out = {};
    for (var it of keys) {
        out = { ...out, ...JustRegex(`${pointer}/${it}`, input[it]) };
    }
    return Object.keys(out).length > 0 ? out : undefined;
}

var Boolify = (pointer, input, options) => {
    var path = convertPointerToPath(pointer);

    var value = undefined;
    if (input === options[0]) {
        value = true;
    }
    if (input === options[1]) {
        value = false;
    }
    return (
        value !== undefined
        ? { [path]: value }
        : undefined
    )
}

var EqualsOneOfTruthyKeys = (pointer, input) => {
    var path = convertPointerToPath(pointer);

    input = input || {};
    var values = Object.keys(input).filter(key => !!input[key]);
    return (
        values.length > 0
        ? { [path]: { $in: values }}
        : undefined
    )
}

var PointWithinOurRange = (pointer, input) => {
    var path = convertPointerToPath(pointer);

    var value = undefined;
    if (input && (input.min || input.max)) {
        value = {
            ...(input.min && { $gte: input.min }),
            ...(input.max && { $lte: input.max })
        };
    }
    return value ? { [path]: value } : undefined;
}

var EqualsOneOf = (pointer, input = {}, options = {}) => {
    var path = convertPointerToPath(pointer);

    var { transform = false } = options;
    var { any, negate, values = [] } = input;
    
    if (input.any === true) {
        var expr = {
            $exists: true,
            $not: { $type: 10 }
        };
        return { [path]: negate ? { $not: expr } : expr };
    }
    
    values = values.filter(it => !!it);
    if (transform) {
        values = values.map(transform);
    }

    var op = negate ? '$nin' : '$in';
    return (
        values.length > 0
        ? { [path]: { [op]: values }}
        : undefined
    );
}

var IncludesOneOf = (pointer, input = {}, options = {}) => {
    var path = convertPointerToPath(pointer);

    var { transform = false } = options;
    var { any, negate, values = [] } = input;

    values = values.filter(it => !!it);
    if (transform) {
        values = values.map(transform);
    }

    if (any) {
        //return { [pointer]: (
        //    negate ? xxx : { $exists: true, $type: 'array', $ne: [] }
        //)}
        return { [`${path}.0`]: {
            $exists: negate ? false : true
        }}
    }

    values = values.filter(it => !!it);
    if (transform) {
        values = values.map(transform);
    }

    var op = negate ? '$nin' : '$in';
    return (
        values.length > 0
        ? { [path]: { [op]: values }}
        : undefined
    )
}

module.exports = {
    JustRegex,
    MultiRegex,
    Boolify,

    IncludesOneOf,
    EqualsOneOf,
    EqualsOneOfTruthyKeys,

    PointWithinOurRange, 
}
