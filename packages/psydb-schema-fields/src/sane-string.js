'use strict';
var SaneString = ({
    default: _default,
    additionalKeywords,
} = {}) => ({
    type: 'string',
    // TODO: this needs a proper pattern
    pattern: '^[^\\r\\n]*$',
    default: _default || '',
    
    ...additionalKeywords,
})

module.exports = SaneString;
