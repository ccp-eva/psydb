'use strict';
// TODO
var Color = ({
    ...additionalKeywords
} = {}) => ({
    type: 'string',
    default: '',
    ...additionalKeywords,
});

module.exports = Color;
