'use strict';
// TODO
var Color = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'Color',
    type: 'string',
    default: '',
    ...additionalKeywords,
});

module.exports = Color;
