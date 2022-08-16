'use strict';
var { arrify, isPromise } = require('@mpieva/psydb-core-utils');

var maybeStages = ({ condition, stages }) => {
    if (!condition) {
        return [];
    }

    if (typeof stages === 'function') {
        stages = stages();
    }
    else {
        //stages = arrify(stages);
    }

    return stages;
}

module.exports = maybeStages;
