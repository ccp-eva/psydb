'use strict';

var BasicArray = (items, additionalKeywords = {}) => ({
    type: 'array',
    ...(items !== undefined && {
        items,
    }),
    ...additionalKeywords
});

module.exports = BasicArray;
