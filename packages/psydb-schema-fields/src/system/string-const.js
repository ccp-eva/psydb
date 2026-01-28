'use strict';
var StringConst = (keywordsOrValue) => {
    if (typeof keywordsOrValue === 'string') {
        var value = keywordsOrValue;
        var extraKeywords = undefined;
    }
    else {
        var { value, ...extraKeywords } = keywordsOrValue;
    }

    var schema = {
        type: 'string',
        const: value,
        default: value,
        ...extraKeywords,
    };

    return schema;
}

module.exports = StringConst;
