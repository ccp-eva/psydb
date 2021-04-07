'use strict';

var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer'),
    convertPointer = require('@mpieva/json-schema-convert-pointer');

var resolveDataPointer = ({
    schema,
    pointer
}) => {
    var resolved = undefined;
    traverse(schema, { allKeys: false }, (...traverseArgs) => {
        var [
            currentSchema,
            inSchemaPointer,
            rootSchema,
            parentInSchemaPointer,
            parentKeyword,
            parentSchema,
            propNameOrIndex
        ] = traverseArgs;

        if (!resolved) {
            var currentDataPointer = convertPointer(inSchemaPointer)
            if (pointer === currentDataPointer) {
                resolved = {
                    schema: currentSchema,
                    inSchemaPointer: inSchemaPointer
                }
            }
        }

    });

    return resolved;
}

module.exports = resolveDataPointer;
