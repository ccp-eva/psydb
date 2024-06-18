'use strict';
var {
    parseSchemaCSV,
    gatherPossibleRefs,
    createRefMappings,
    
    resolveRefs,
    replaceRefsByMapping
} = require('../common');

var CSVSchema = require('./csv-schema');
var customColumnRemap = require('./custom-column-remap');

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

    var refData = gatherPossibleRefs({ schema });
    var refMappings = await createRefMappings({
        refData, items: preparedObjects
    });

    var { resolvedRecords, resolvedHSIs } = await resolveRefs({
        db, tokenMapping: refMappings,
        extraRecordResolvePointers: { subject: [
            '/scientific/state/custom/wkprcIdCode'
        ]},
    });

    replaceRefsByMapping({
        inItems: preparedObjects,
        refMappings, resolvedRecords, resolvedHSIs
    });
        
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
