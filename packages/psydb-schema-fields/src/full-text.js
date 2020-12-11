'use strict';
var FullText = ({
    type,
    minLength,
    maxLength,
    ...additionalKeywords
} = {}) => ({
    type: 'string',
    default: '',
    transform: [ 'trim' ],
    
    // FIXME: in my opinion this is a stupid hacky way of doing that
    // but its the only way to transform bevore validation
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
    
    'ui:widget': 'textarea',
    ...additionalKeywords,
});

module.exports = FullText;
