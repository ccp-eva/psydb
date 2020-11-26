'use strict';
var FullText = ({
    default,
    additionalKeywords
}) => ({
    type: 'string',
    default: default || '',
    
    'ui:widget': 'textarea',
    ...additionalKeywords,
});

module.exports = FullText;
