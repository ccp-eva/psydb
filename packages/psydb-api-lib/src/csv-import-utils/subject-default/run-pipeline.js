'use strict';
var parseLines = require('./parse-lines');
var matchData = require('./match-data');
var makeObjects = require('./make-objects');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines,

        subjectCRT,
        researchGroup,
        timezone
    } = bag;

    var parsedLines = parseLines({ data: csvLines, subjectCRT });
    var matchedData = await matchData({ db, parsedLines });
    var preparedObjects = makeObjects({ matchedData });

    var transformed = transformPrepared({
        preparedObjects,

        subjectCRT,
        researchGroup,
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
