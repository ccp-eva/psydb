'use strict';
var { ExactObject } = require('../core-compositions');
var { Integer } = require('../common');

var AgeFrameBoundary = ({ minimum, ...additionalKeywords } = {}) => (
    ExactObject({
        systemType: 'AgeFrameBoundary',
        properties: {
            years: Integer(),
            months: Integer({ maximum: 12 }),
            days: Integer({ maximum: 31 }),
        },
        required: ['years', 'months', 'days'],
        ...additionalKeywords,
    })
);

module.exports = AgeFrameBoundary;
