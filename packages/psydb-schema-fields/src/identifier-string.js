'use strict';
var IdentifierString = ({
    ...additionalKeywords
} = {}) => {
    return {
        systemType: 'IdentifierString',
        type: 'string',
        default: '',
        pattern: '^[a-zA-Z]*$',
        ...additionalKeywords,
    };
}

module.exports = IdentifierString;
