'use strict';
var { gatherRefs, resolveRefs, replaceRefs } = require('../common');


var matchData = async (bag) => {
    var { db, parsedLines } = bag;
  
    var { recordRefs, hsiRefs } = gatherRefs({
        parsedLines
    });

    var { resolvedRecords, resolvedHSIs } = await resolveRefs({
        db, recordRefs, hsiRefs,
        extraRecordResolvePointers: { subject: [
            '/scientific/state/custom/wkprcIdCode'
        ]},
    });

    replaceRefs({
        parsedLines,
        resolvedRecords, resolvedHSIs,
        skipEmptyRefs: true
    });

    //console.log(parsedLines);

    return parsedLines;
}


module.exports = matchData;
