'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { parseSchemaCSV, injectRefIds } = require('../common');

var CSVSchema = require('./csv-schema');
var ColumnRemapper = require('./column-remapper');

//var __parseLines = require('./parse-lines');
//var matchData = require('./match-data');
//var makeObjects = require('./make-objects');
var transformPrepared = require('./transform-prepared');

var runPipeline = async (bag) => {
    var {
        db,
        csvLines: csvData,
        subjectCRT,
        researchGroup,
        timezone
    } = bag;

    var schema = CSVSchema({ subjectCRT });
    var customColumnRemap = ColumnRemapper({ subjectCRT });

    var parsed = parseSchemaCSV({
        csvData, schema, unmarshalClientTimezone: timezone,
        customColumnRemap,
    });
    
    var parsedLines = parsed.map(it => it.csvLine);
    var preparedObjects = parsed.map(it => it.obj);

    await injectRefIds({ db, schema, into: preparedObjects });

    var transformed = transformPrepared({
        preparedObjects,

        subjectCRT,
        researchGroup,
        timezone
    });

    return {
        parsedLines,
        preparedObjects,
        transformed
    }
}

module.exports = runPipeline;
