'use strict';
var StringEnum = require('./string-enum');

var ExperimentVariantEnum = (additionalKeywords) => {
    return StringEnum([
        'online-survey',
        'online-video-call',
        'inhouse',
        'away-team',
    ], additionalKeywords)
}

module.exports = ExperimentVariantEnum;
