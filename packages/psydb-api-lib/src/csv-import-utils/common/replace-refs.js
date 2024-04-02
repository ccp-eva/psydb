'use strict';
var { arrify } = require('@mpieva/psydb-core-utils');
var {
    hasRecordValues,
    hasHSIValues,
    hasRefValues,
} = require('./utils');


var replaceRefs = (bag) => {
    var {
        parsedLines,
        resolvedRecords,
        resolvedHSIs,
        skipEmptyRefs = false,
    } = bag;
    
    for (var line of parsedLines) {
        for (var lineitem of line) {
            var { definition, value, extraPath } = lineitem;
            var { systemType, props } = definition;
          
            if (hasRefValues(systemType)) {
                var bucket = undefined;
                if (hasRecordValues(systemType)) {
                    bucket = resolvedRecords[props.collection];
                }
                if (hasHSIValues(systemType)) {
                    bucket = resolvedHSIs[props.setId];
                }

                if (skipEmptyRefs &&  value === '') {
                    continue;
                }

                var matched = matchRefs({
                    from: bucket,
                    refs: arrify(value)
                });
                
                lineitem.value = (
                    Array.isArray(value)
                    ? matched
                    : matched[0]
                );
            }
        }
    }
}

var matchRefs = (bag) => {
    var { from, refs } = bag;
    
    var out = [];
    for (var r of refs) {
        var matched = from.filter(it => (
            String(it.value) === String(r)
        ));
        if (matched.length < 1) {
            // TODO
            throw new Error('could not resolve');
        }
        if (matched.length > 1) {
            // TODO
            throw new Error('resolve is ambigous');
        }
        out.push(matched[0]._id);
    }
    return out;
}

module.exports = replaceRefs;
