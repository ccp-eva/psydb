'use strict';
var URLString = ({
    minLength,
    maxLength,
    ...additionalKeywords
} = {}) => {
    return {
        systemType: 'URLString',
        type: 'string',
        default: '',
        pattern: '^https?://',

        // FIXME: in my opinion this is a stupid hacky way of doing that
        // but its the only way to transform bevore validation
        // TODO; rjsf does not suport costum ajv keywords for some reason
        allOf: [
            { transform: [ 'trim' ] },
            ...(
                minLength || maxLength
                ? [{
                    ...(minLength && { minLength }),
                    ...(maxLength && { maxLength }),
                }]
                : []
            ),
        ],

        ...additionalKeywords,
    };
}

module.exports = URLString;
