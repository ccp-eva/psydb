'use strict';
var makeRX = require('./make-rx');

var JustRegex = (pointer, input) => (
    input
    ? { [pointer]: makeRX(input) }
    : undefined
);

var MultiRegex = (pointer, input, keys) => {
    input = input || {};
    var out = {};
    for (var it of keys) {
        out = { ...out, ...JustRegex(`${pointer}/${it}`, input[it]) };
    }
    return Object.keys(out).length > 0 ? out : undefined;
}

var Boolify = (pointer, input, options) => {
    var value = undefined;
    if (input === options[0]) {
        value = true;
    }
    if (input === options[1]) {
        value = false;
    }
    return (
        value !== undefined
        ? { [pointer]: value }
        : undefined
    )
}

var EqualsOneOfTruthyKeys = (pointer, input) => {
    input = input || {};
    var values = Object.keys(input).filter(key => !!input[key]);
    return (
        values.length > 0
        ? { [pointer]: { $in: values }}
        : undefined
    )
}

var PointWithinOurRange = (pointer, input) => {
    var value = undefined;
    if (input && (input.min || input.max)) {
        value = {
            ...(input.min && { $gte: input.min }),
            ...(input.max && { $lte: input.max })
        };
    }
    return value ? { [pointer]: value } : undefined;
}

var EqualsOneOf = (pointer, input = {}, options = {}) => {
    var { transform = false } = options;
    var { any, negate, values = [] } = input;
    
    if (input.any === true) {
        var expr = {
            $exists: true,
            $not: { $type: 10 }
        };
        return { [pointer]: negate ? { $not: expr } : expr };
    }
    
    values = values.filter(it => !!it);
    if (transform) {
        values = values.map(transform);
    }

    var op = negate ? '$nin' : '$in';
    return (
        values.length > 0
        ? { [pointer]: { [op]: values }}
        : undefined
    );
}

var IncludesOneOf = (pointer, input = {}, options = {}) => {
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
        return { [`${pointer}/0`]: {
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
        ? { [pointer]: { [op]: values }}
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
