'use strict';
var { ExactObject } = require('../core-compositions');
var DateOnlyServerSide = require('./date-only-server-side');

var DateOnlyServerSideInterval = ({
    additionalStartKeywords,
    additionalEndKeywords,
    ...additionalKeywords
} = {}) => ExactObject({
    systemType: 'DateOnlyServerSideInterval',
    properties: {
        start: DateOnlyServerSide({ ...additionalStartKeywords }),
        end: DateOnlyServerSide({
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

module.exports = DateOnlyServerSideInterval;
