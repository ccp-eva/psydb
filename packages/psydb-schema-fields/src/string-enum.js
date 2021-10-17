'use strict';

var StringEnum = (enumKeys, {
    const: constValue,
    ...additionalKeywords
} = {}) => ({
    type: 'string',
    ...(
        constValue
        ? { enum: enumKeys }
        : { const: constValue }
    ),
    ...additionalKeywords,
});

module.exports = StringEnum;
