'use strict';
var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer'),
    inline = require('@cdxoo/inline-text'),
    deconstructArrays = require('@mpieva/json-schema-deconstruct-arrays'),
    convertPointer = require('@mpieva/json-schema-convert-pointer');

//var PointerMapping = require('./pointer-mapping');
var OneofResolver = require('./oneof-resolver');

var lazyResolveAll = (schema, data) => {
    var schemaParts = deconstructArrays(schema);
    //console.dir(schemaParts, { depth: null });
    
    var resolvedParts = [];
    for (var part of schemaParts) {
        var { inSchemaPointer, schema } = part;
        
        var dataPointer = convertPointer(inSchemaPointer),
            partData = jsonpointer.get(data, dataPointer);

        var requiredType = 'array';
        // we need to check this for the schema root as it might
        // or might not be an array; other parts are always array
        if (inSchemaPointer === '') {
            requiredType = jsonpointer.get(schema, inSchemaPointer).type;
        }

        //console.log(inSchemaPointer, dataPointer, partData, requiredType);
        if (requiredType === 'array') {
            resolvedParts.push({
                type: 'array',
                inSchemaPointer,
                itemSchemas: lazyResolveArrayPart(schema, partData)
            });
        }
        else {
            resolvedParts.push({
                type: 'schema',
                inSchemaPointer,
                schema: lazyResolve(schema, partData)
            });
        }
    }

    return resolvedParts;
}

var lazyResolveArrayPart = (schema, data) => {
    if (!Array.isArray(data)) {
        return [];
    }
    if (!data.length) {
        return [];
    }

    var resolved = [];
    for (var item of data) {
        resolved.push(lazyResolve(schema, item));
    }
    return resolved;
}

var lazyResolve = (schema, data) => {
    // this wrapper enables us to replace the schema root if required
    var evilRefHack = { schema };

    //var pointerMapping = PointerMapping();
    var oneofResolver = OneofResolver();
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

        //pointerMapping.addFromTraverse(...traverseArgs);
        
        //var dataPointer = pointerMapping.get(inSchemaPointer);
        var dataPointer = convertPointer(inSchemaPointer);
        var currentData = jsonpointer.get(data, dataPointer);

        // NOTE: this should never happen as we deconstruct schema arrays
        if (currentSchema.type === 'array' && currentSchema.items) {
            throw new Error(inline`
                array with item definition found in "${inSchemaPointer}";
                its not possible to resolve wihtin array item definitions,
                the items in the corresponding array must be resolved
                individially
            `);
        }

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

module.exports = lazyResolveAll;
