'use strict';
var traverse = require('json-schema-traverse');

var resolvePossibleRefs = (schema, options = {}) => {
    var {
        systemTypes = [ 'ForeignId', 'HelperSetItemId' ]
    } = options;

    var out = [];

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

        var { systemType, systemProps } = currentSchema;
        if (systemTypes.includes(systemType)) {
            out.push({
                schemaPointer: inSchemaPointer,
                systemType,
                systemProps
            });
        }
    });

    return out;
}

module.exports = resolvePossibleRefs;
