'use strict';
var parseLines = require('./parse-lines');
var matchData = require('./match-data');
var makeObjects = require('./make-objects');
var verifySameSubjectType = require('./verify-same-subject-type');
var verifySameSubjectGroup = require('./verify-same-subject-group');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines,
   
        subjectType,
        study,
        location,
        labOperators,
        timezone
    } = bag;

    var parsedLines = parseLines({ data: csvLines });
    var matchedData = await matchData({ db, parsedLines });
    var preparedObjects = makeObjects({ matchedData, skipEmptyValues: true });

    await verifySameSubjectType({ db, subjectType, preparedObjects });
    await verifySameSubjectGroup({ db, preparedObjects });

    var transformed = transformPrepared({
        preparedObjects,

        subjectType,
        study,
        location,
        labOperators,
        timezone
    });

    return {
        parsedLines,
        matchedData,
        preparedObjects,
        transformed
    }
}

module.exports = runPipeline;
