'use strict';
var Integer = ({
    ...additionalKeywords
} = {}) => {
    return {
        systemType: 'Integer',
        type: 'integer',
        default: 0,
        ...additionalKeywords,
    };
}

module.exports = Integer;
