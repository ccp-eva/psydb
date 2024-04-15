'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { gatherRefs, resolveRefs, replaceRefs } = require('../common');


var matchData = async (bag) => {
    var { db, parsedLines } = bag;
  
    var { recordRefs, hsiRefs } = gatherRefs({
        parsedLines
    });

    var { resolvedRecords, resolvedHSIs } = await resolveRefs({
        db, recordRefs, hsiRefs
    });

    replaceRefs({
        parsedLines,
        resolvedRecords, resolvedHSIs
    });

    return parsedLines;
}


module.exports = matchData;
