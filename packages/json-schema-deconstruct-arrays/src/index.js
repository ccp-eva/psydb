'use strict';
var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer'),
    createClone = require('copy-anything').copy;

var deconstructArrays = (schema) => {
    // clone because schema gets destroyed in the process
    // as jsonpointer.set() is mutable
    schema = createClone(schema);

    var arrayPointers = [];
    traverse(schema, { allKeys: false }, (currentSchema, inSchemaPointer) => {
        if (currentSchema.type === 'array') {
            arrayPointers.push(inSchemaPointer);
        }
    });

    var parts = [];
    for (var i = arrayPointers.length - 1; i >= 0; i -= 1) {
        var inSchemaPointer = arrayPointers[i];
        parts.push({
            inSchemaPointer,
            schema: jsonpointer.get(schema, inSchemaPointer).items,
        });
        // this operation mutates the schema object
        jsonpointer.set(schema, inSchemaPointer, { type: 'array' })
    }

    // add the root part, which is the rest of the mutated schema
    parts.push({
        inSchemaPointer: "",
        schema,
    });

    return parts.reverse();
}

module.exports = deconstructArrays;
