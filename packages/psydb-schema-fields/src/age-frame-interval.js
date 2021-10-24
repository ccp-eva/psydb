'use strict';
var ExactObject = require('./exact-object'),
    AgeFrameBoundary = require('./age-frame-boundary');

var AgeFrameInterval = ({
    startKeywords,
    endKeywords,
    ...additionalKeywords
} = {}) => ExactObject({
    systemType: 'AgeFrameInterval',
    properties: {
        start: AgeFrameBoundary({ ...startKeywords }),
        end: AgeFrameBoundary({ ...endKeywords })
    },
    required: [ 'start', 'end' ],
    ...additionalKeywords,
});

module.exports = AgeFrameInterval;
