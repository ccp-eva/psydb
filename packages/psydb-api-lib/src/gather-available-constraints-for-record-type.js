'use strict';
var traverse = require('json-schema-traverse');
var convertPointer = require('@mpieva/json-schema-convert-pointer');
var { Id } = require('@mpieva/psydb-schema-fields');
var createSchemaForRecordType = require('./create-schema-for-record-type');

var gatherAvailableConstraintsForRecordType = async ({
    db,
    collectionName,
    recordType
}) => {

    if (collectionName === 'customRecordType') {
        return {};
    }
    
    var fullRecordSchema = await createSchemaForRecordType({
        db,
        collectionName,
        recordType,
        fullSchema: true
    });

    //console.log(fullRecordSchema);
    
    var availableConstraints = {
        '/_id': { type: 'array', items: Id() },
    };

    traverse(fullRecordSchema, { allKeys: false }, (...traverseArgs) => {
        var [
            currentSchema,
            inSchemaPointer,
        ] = traverseArgs;
        
        var { type } = currentSchema;

        // what we want are essentially leaf nodes but not additional stuff
        // such as allOf in SaneString()
        if (type && type !== 'object' && type !== 'array') {
            var dataPointer = convertPointer(
                inSchemaPointer, undefined, { forceLazy: true }
            );

            //console.log(currentSchema);
            //console.log(inSchemaPointer, dataPointer)
            availableConstraints[dataPointer] = currentSchema;
        }
    });


    return availableConstraints;
}

module.exports = gatherAvailableConstraintsForRecordType;
