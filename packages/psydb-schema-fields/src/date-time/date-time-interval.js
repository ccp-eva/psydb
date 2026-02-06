'use strict';
var { ExactObject } = require('../core-compositions');
var DateTime = require('./date-time');

var DateTimeInterval = ({
    additionalStartKeywords,
    additionalEndKeywords,
    ...additionalKeywords
} = {}) => ExactObject({
    systemType: 'DateTimeInterval',
    properties: {
        start: DateTime({ ...additionalStartKeywords, }),
        end: DateTime({
            formatMinimum: {
                $data: '2/start/$date'
            },
            ...additionalEndKeywords,
        })
    },
    required: [
        'start',
        'end',
    ],
    ...additionalKeywords,
});

module.exports = DateTimeInterval;
