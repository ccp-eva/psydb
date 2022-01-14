'use strict';

var StringConst = ({
    value,
    ...additionalKeywords
} = {}) => ({
    type: 'string',
    const: value,
    ...additionalKeywords,
});

module.exports = StringConst;
