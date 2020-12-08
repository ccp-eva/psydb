'use strict';
var FullText = ({
    default: _default,
    additionalKeywords
} = {}) => ({
    type: 'string',
    default: _default || '',
    
    'ui:widget': 'textarea',
    ...additionalKeywords,
});

module.exports = FullText;
