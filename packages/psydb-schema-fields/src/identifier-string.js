'use strict';
var IdentifierString = ({
    minLength,
    maxLength,
    ...additionalKeywords
} = {}) => {
    return {
        systemType: 'IdentifierString',
        type: 'string',
        default: '',
        pattern: '^[a-zA-Z]*$',

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

module.exports = IdentifierString;
