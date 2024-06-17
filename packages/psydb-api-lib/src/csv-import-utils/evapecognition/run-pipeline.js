'use strict';
var { entries, jsonpointer } = require('@mpieva/psydb-core-utils');
var {
    parseSchemaCSV,
    gatherSchemaRefs,
    resolveRefs,
} = require('../common');

var CSVSchema = require('./csv-schema');
var customColumnRemap = require('./custom-column-remap');

//var parseLines = require('./parse-lines');
//var matchData = require('./match-data');
//var makeObjects = require('./make-objects');
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

    var schema = CSVSchema();
    
    var parsed = parseSchemaCSV({
        csvData: csvLines,
        schema,
        unmarshalClientTimezone: timezone,
        customColumnRemap,
    });

    var parsedLines = parsed.map(it => it.csvLine);
    var preparedObjects = parsed.map(it => it.obj);

    var { tokenMapping } = await gatherSchemaRefs({
        fromItems: preparedObjects, schema
    });

    var { resolvedRecords, resolvedHSIs } = await resolveRefs({
        db, tokenMapping,
        extraRecordResolvePointers: { subject: [
            '/scientific/state/custom/wkprcIdCode'
        ]},
    });
        
    for (var [ix, recordTokenMapping] of tokenMapping.entries()) {
        for (var m of recordTokenMapping) {
            var { dataPointer, collection, value } = m;
            var records = resolvedRecords[collection].filter(
                it => it.value === value
            );
            if (records.length !== 1) {
                throw new Error('multiple or non mappable records');
            }

            jsonpointer.set(
                preparedObjects[ix],
                dataPointer,
                records[0]._id
            );
        }
    }

    //var parsedLines = parseLines({ data: csvLines });
    //var matchedData = await matchData({ db, parsedLines });
    //var preparedObjects = makeObjects({ matchedData, skipEmptyValues: true });

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
        preparedObjects,
        transformed
    }
}

module.exports = runPipeline;
