'use strict';
var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer');

var PointerMapping = require('./pointer-mapping'),
    OneofResolver = require('./oneof-resolver');

var lazyResolve = (schema, data) => {
    // this wrapper enables us to replace the schema root if required
    var evilRefHack = { schema };

    var pointerMapping = PointerMapping(),
        oneofResolver = OneofResolver();
    var transformations = [];

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

        pointerMapping.addFromTraverse(...traverseArgs);
        
        var dataPointer = pointerMapping.get(inSchemaPointer);
        var currentData = jsonpointer.get(data, dataPointer);

        if (currentSchema.oneOf) {
            oneofResolver.resolve({
                traverseArgs,
                currentData,
            });
        }

    });

    var transformations = oneofResolver.transformations();
    for (var i = transformations.length - 1; i >= 0; i -= 1) {
        var { from, to } = transformations[i];
        from = `/schema${from}`;
        to = `/schema${to}`;

        jsonpointer.set(
            evilRefHack,
            from,
            jsonpointer.get(evilRefHack, to)
        );
    }

    return evilRefHack.schema;
}

module.exports = lazyResolve;
