'use strict';
var SaneString = ({
    default,
    additionalKeywords,
}) => ({
    type: 'string',
    // TODO: this needs a proper pattern
    pattern: '^[^\\r\\n]*$',
    default: default || '',
    
    ...additionalKeywords,
})

module.exports = SaneString;
