'use strict';
// TODO
var Color = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'Color',
    type: 'string',
    format: 'hex-color',
    default: '',
    ...additionalKeywords,
});

module.exports = Color;
