'use strict';

var traverse = require('json-schema-traverse'),
    convertPointer = require('@mpieva/json-schema-convert-pointer');

var createSchemaForRecordType = require('./create-schema-for-record-type');

var gatherAvailableConstraintsForRecordType = async ({
    collectionName,
    recordType
}) => {
    
    var fullRecordSchema = await createSchemaForRecordType({
        collectionName,
        recordType,
        fullSchema: true
    });

    //console.log(fullRecordSchema);
    
    var availableConstraints = {};

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
