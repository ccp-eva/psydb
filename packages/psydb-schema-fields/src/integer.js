'use strict';
var Integer = ({
    isNullable,
    ...additionalKeywords
} = {}) => {
    return {
        systemType: 'Integer',
        type: (
            isNullable
            ? ['null', 'integer']
            : 'integer'
        ),
        default: (
            isNullable
            ? null
            : 0
        ),
        ...additionalKeywords,
    };
}

module.exports = Integer;
