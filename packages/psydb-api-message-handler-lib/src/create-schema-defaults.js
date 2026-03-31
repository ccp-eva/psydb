'use strict';
var traverse = require('json-schema-traverse');
var convertPointer = require('@cdxoo/jsonschema-to-datapointer');
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { PsyDBSchema } = require('@mpieva/psydb-schema');

var createSchemaDefaults = (schema, options = {}) => {
    var out = {};

    if (schema instanceof PsyDBSchema) {
        schema = schema.createJSONSchema();
    }

    traverse(schema, { allKeys: false }, (...traverseArgs) => {
        var [
            currentSchema,
            inSchemaPointer,
        ] = traverseArgs;

        var dataPointer = undefined;
        try {
            dataPointer = convertPointer(inSchemaPointer);
        }
        catch (e) {
            // ignore inconvertable pointers
            // console.log(e.message);
        }

        if (dataPointer && currentSchema.hasOwnProperty('default')) {
            jsonpointer.set(out, dataPointer, currentSchema.default);
        }
    });

    return out;
}

module.exports = createSchemaDefaults;
