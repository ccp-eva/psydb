'use strict';
var {
    jsonpointer, arrify, forcePush, entries, convertPointerToPath, ejson
} = require('@mpieva/psydb-core-utils');

var gatherRefs = require('./gather-refs');
var resolveRefs = require('./resolve-refs');
var replaceRefs = require('./replace-refs');


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
