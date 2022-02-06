'use strict';
var datefns = require('date-fns');
var { timeshiftAgeFrame } = require('@mpieva/psydb-common-lib');
var convertPointerToPath = require('../../convert-pointer-to-path');

var makeAgeFrameIntervalCondition = (options) => {
    var {
        ageFrameTargetDefinition,
        searchInterval,
        ageFrameInterval,
    } = options;

    var { start, end } = timeshiftAgeFrame({
        targetInterval: searchInterval,
        ageFrame: ageFrameInterval,
    });

    var { pointer } = ageFrameTargetDefinition;
    var path = '$' + convertPointerToPath(pointer);

    return { $and: [
        { $gte: [ path, start ]},
        { $lt: [ path, end ]},
    ]};
}

module.exports = makeAgeFrameIntervalCondition;
