'use strict';

var lazyResolveOneOf = require('@mpieva/json-schema-lazy-resolve-oneof');

var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer'),
    convertPointer = require('@mpieva/json-schema-convert-pointer');

var resolveForeignIdData = ({ schema, data }) => {

    //console.dir(channelStateSchema, { depth: null });

    var resolvedParts = lazyResolveOneOf(schema, data);

    //console.dir(resolvedParts, { depth: null });

    var foreignIdRelationData = [];
    var helperSetItemIdRelationData = [];
    for (var part of resolvedParts) {
        //console.log(part);
        //console.log(part.type);
        if (part.type === 'schema') {
            var dataPointer = convertPointer(part.inSchemaPointer);
            var currentData = jsonpointer.get(data, dataPointer);
            
            var resolved = resolveFromSubSchema({
                schema: part.schema,
                data: currentData,
                dataPointerPrefix: dataPointer
            });

            helperSetItemIdRelationData = [
                ...helperSetItemIdRelationData,
                ...resolved.helperSetItemIdRelationData,
            ];

            foreignIdRelationData = [
                ...foreignIdRelationData,
                ...resolved.foreignIdRelationData,
            ];
        }
        else if (part.type === 'array') {
            var dataPointers = convertPointer(
                part.inSchemaPointer,
                data
            );

            for (var [index, itemSchema] of part.itemSchemas.entries()) {
                //console.log(dataPointers[index]);
                var currentData = jsonpointer.get(data, dataPointers[index]);

                var resolved = resolveFromSubSchema({
                    schema: itemSchema,
                    data: currentData,
                    dataPointerPrefix: dataPointers[index]
                });

                helperSetItemIdRelationData = [
                    ...helperSetItemIdRelationData,
                    ...resolved.helperSetItemIdRelationData,
                ];

                foreignIdRelationData = [
                    ...foreignIdRelationData,
                    ...resolved.foreignIdRelationData,
                ];
            }
        }
    }

    //console.dir(resolvedForeignIdData);
    //throw new Error();
    return {
        foreignIdRelationData,
        helperSetItemIdRelationData,
    };
}

var resolveFromSubSchema = ({
    schema,
    data,
    dataPointerPrefix,
}) => {
    //console.log(dataPointerPrefix, schema, data);
    var foreignIdRelationData = [];
    var helperSetItemIdRelationData = [];
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

        if (
            currentSchema.systemType === 'ForeignId'
            || currentSchema.systemType === 'HelperSetItemId'
        ) {
            var currentData = data,
                dataPointer = '';
            if (typeof data === 'object') {
                dataPointer = convertPointer(inSchemaPointer);
                currentData = jsonpointer.get(data, dataPointer);
            }

            var fullDataPointer = `${dataPointerPrefix || ''}${dataPointer}`;

            var dataBucket = (
                currentSchema.systemType === 'ForeignId'
                ? foreignIdRelationData
                : helperSetItemIdRelationData
            );

            dataBucket.push({
                ...currentSchema.systemProps,
                dataPointer: fullDataPointer,
                value: currentData,
            });
            //console.log(currentData);
        }
    });
    return {
        foreignIdRelationData,
        helperSetItemIdRelationData,
    };
}

module.exports = resolveForeignIdData;
