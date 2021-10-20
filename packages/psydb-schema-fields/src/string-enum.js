'use strict';

var StringEnum = (enumKeys, {
    const: constValue,
    ...additionalKeywords
} = {}) => ({
    type: 'string',
    ...(
        constValue
        ? { const: constValue }
        : { enum: enumKeys }
    ),
    ...additionalKeywords,
});

module.exports = StringEnum;
