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
        out = { ...out, ...JustRegex(`${pointer}/${it}`, input[key]) };
    }
    return Object.keys(out) > 0 ? out : undefined;
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

var MongoFk = (pointer, input, props) => {
    input = input || {};
    var { isNullable } = props; // TODO
    // input.any

    var op = input.negate ? '$nin' : '$in';
    return (
        input.values && input.values.length > 0
        ? { [pointer]: { [op]: input.values.map(ObjectId) }}
        : undefined
    )
}

var MongoFkList = (pointer, input) => {
    input = input || {};
    var op = input.negate ? '$nin' : '$in';
    return (
        input.values && input.values.length > 0
        ? { [pointer]: { [op]: input.values.map(ObjectId) }}
        : undefined
    )
}
