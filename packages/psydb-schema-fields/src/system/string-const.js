'use strict';
var StringConst = (bag = {}) => {
    var { value, ...extraKeywords } = bag;

    var schema = {
        type: 'string',
        const: value,
        default: value,
        ...extraKeywords,
    };

    return schema;
}

module.exports = StringConst;
