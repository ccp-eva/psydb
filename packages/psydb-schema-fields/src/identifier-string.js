'use strict';
var IdentifierString = ({
    ...additionalKeywords
} = {}) => {
    return {
        type: 'string',
        default: '',
        pattern: '^[a-zA-Z]*$',
        ...additionalKeywords,
    };
}

module.exports = IdentifierString;
