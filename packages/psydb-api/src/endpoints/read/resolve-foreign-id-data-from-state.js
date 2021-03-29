'use strict';

var lazyResolveOneOf = require('@mpieva/json-schema-lazy-resolve-oneof');

var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer'),
    convertPointer = require('@mpieva/json-schema-convert-pointer');

var resolveForeignIdDataFromState = ({ stateSchema, stateData }) => {

    //console.dir(channelStateSchema, { depth: null });

    var resolvedParts = lazyResolveOneOf(stateSchema, stateData);

    //console.dir(resolvedParts, { depth: null });

    var resolvedForeignIdData = [];
    for (var part of resolvedParts) {
        //console.log(part.type);
        if (part.type === 'schema') {
            var dataPointer = convertPointer(part.inSchemaPointer);
            var currentData = jsonpointer.get(stateData, dataPointer);
            
            var foreign = resolveFromSubSchema({
                schema: part.schema,
                data: currentData,
                dataPointerPrefix: dataPointer
            });

            resolvedForeignIdData = [
                ...resolvedForeignIdData,
                ...foreign,
            ];
        }
        else if (part.type === 'array') {
            for (var [index, itemSchema] of part.itemSchemas.entries()) {
                var dataPointer = convertPointer(
                    part.inSchemaPointer + '/' + index
                );
                var currentData = jsonpointer.get(stateData, dataPointer);

                var foreign = resolveFromSubSchema({
                    schema: itemSchema,
                    data: currentData,
                    dataPointerPrefix: dataPointer
                });

                resolvedForeignIdData = [
                    ...resolvedForeignIdData,
                    ...foreign,
                ];
            }
        }
    }

    return resolvedForeignIdData;
}

var resolveFromSubSchema = ({
    schema,
    data,
    dataPointerPrefix,
}) => {
    //console.log(schema);
    var resolved = [];
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

        if (currentSchema.psydbType === 'ForeignId') {
            var currentData = data,
                dataPointer = '';
            //console.log('AAAAAAAAAAAAAA');
            //console.log(data);
            if (typeof data === 'object') {
                dataPointer = convertPointer(inSchemaPointer);
                currentData = jsonpointer.get(data, dataPointer);
            }

            var fullDataPointer = dataPointer;
            if (dataPointerPrefix) {
                if (dataPointer) {
                    fullDataPointer = `${dataPointerPrefix}/${dataPointer}`;
                }
                else {
                    fullDataPointer = dataPointerPrefix;
                }
            }
            resolved.push({
                ...currentSchema.psydbProps,
                dataPointer: fullDataPointer,
                id: currentData,
            });
            //console.log(currentData);
        }
    });
    return resolved;
}

module.exports = resolveForeignIdDataFromState;
