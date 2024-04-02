'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { gatherRefs, resolveRefs, replaceRefs } = require('../common');


var matchSubjectCSVData = async (bag) => {
    var { db, parsedLines } = bag;
  
    var { recordRefs, hsiRefs } = gatherRefs({
        parsedLines
    });

    var { resolvedRecords, resolvedHSIs } = await resolveRefs({
        db, recordRefs, hsiRefs
    });

    console.dir(
        ejson({ resolvedRecords, resolvedHSIs }),
        { depth: null }
    );

    replaceRefs({
        parsedLines,
        resolvedRecords, resolvedHSIs
    });

    console.log(parsedLines);
}


module.exports = matchSubjectCSVData;
