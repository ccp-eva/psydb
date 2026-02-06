'use strict';

var BasicBool = ({ ...additionalKeywords } = {}) => ({
    type: 'boolean',
    ...additionalKeywords
});

module.exports = BasicBool;
