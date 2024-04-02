'use strict';
var { arrify, forcePush } = require('@mpieva/psydb-core-utils');
var {
    hasRecordValues,
    hasHSIValues,
} = require('./utils');


var gatherRefs = (bag) => {
    var { parsedLines } = bag;
    
    var recordRefs = {};
    var hsiRefs = {};

    for (var line of parsedLines) {
        for (var lineitem of line) {
            var { definition, value, extraPath } = lineitem;
            var { systemType, props } = definition;
    
            if (hasRecordValues(systemType)) {
                var { collection } = props;
                forcePush({
                    into: recordRefs,  pointer: `/${collection}`,
                    values: arrify(value)
                })
            }
            if (hasHSIValues(systemType)) {
                var { setId } = props;
                forcePush({
                    into: hsiRefs,  pointer: `/${setId}`,
                    values: arrify(value)
                })
            }
        }
    }

    return { recordRefs, hsiRefs }
}

module.exports = gatherRefs;
