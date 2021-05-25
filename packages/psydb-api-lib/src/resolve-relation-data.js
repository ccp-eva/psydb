'use strict';

var lazyResolveOneOf = require('@mpieva/json-schema-lazy-resolve-oneof');

var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer'),
    convertPointer = require('@mpieva/json-schema-convert-pointer');

var resolveRelationData = ({ schema, data }) => {

    //console.dir(schema, { depth: null });
    //console.dir(data, { depth: null });
    //console.dir(channelStateSchema, { depth: null });

    var resolvedParts = lazyResolveOneOf(schema, data);
    //console.dir(resolvedParts, { depth: null });
    //throw new Error();

    //console.dir(resolvedParts, { depth: null });

    var foreignIdRelationData = [];
    var helperSetItemIdRelationData = [];
    var customRecordTypeRelationData = [];
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
            
            customRecordTypeRelationData = [
                ...customRecordTypeRelationData,
                ...resolved.customRecordTypeRelationData,
            ];
        }
        else if (part.type === 'array') {
            //console.log('#########PART')
            //console.log(part.inSchemaPointer);
            //console.log(part);
            /*var dataPointers = convertPointer(
                part.inSchemaPointer,
                data
            );*/
            // XXX 2 data pointers bbut only one schema
            // XXX 2 data pointers bbut only one schema
            // XXX 2 data pointers bbut only one schema
            // XXX 2 data pointers bbut only one schema
            //console.log('===================>')
            //console.log('dataPointers', dataPointers);

            for (var [index, itemSchemaContainer] of part.itemSchemas.entries()) {
                var itemSchema = itemSchemaContainer.schema;
                var dataPointer = itemSchemaContainer.fullDataPointer;

                var currentData = jsonpointer.get(data, dataPointer);

                var resolved = resolveFromSubSchema({
                    schema: itemSchema,
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
            
                customRecordTypeRelationData = [
                    ...customRecordTypeRelationData,
                    ...resolved.customRecordTypeRelationData,
                ];
            }
        }
    }

    //console.dir(resolvedForeignIdData);
    //throw new Error();
    return {
        foreignIdRelationData,
        helperSetItemIdRelationData,
        customRecordTypeRelationData,
    };
}

var resolveFromSubSchema = ({
    schema,
    data,
    dataPointerPrefix,
}) => {
    //console.log(dataPointerPrefix, schema, data);
    //console.log(dataPointerPrefix);
    var foreignIdRelationData = [];
    var helperSetItemIdRelationData = [];
    var customRecordTypeRelationData = [];
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

        //console.log(currentSchema.systemType);
        if (
            currentSchema.systemType === 'ForeignId'
            || currentSchema.systemType === 'HelperSetItemId'
            || currentSchema.systemType === 'CustomRecordTypeKey'
        ) {
            //console.log('AAAAAAAAAA');
            //console.log(currentSchema);
            //console.log(data)
            //console.log('PUSHING ####################')
            var currentData = data,
                dataPointer = '';
            if (typeof data === 'object') {
                dataPointer = convertPointer(inSchemaPointer);
                currentData = jsonpointer.get(data, dataPointer);
            }

            var fullDataPointer = `${dataPointerPrefix || ''}${dataPointer}`;

            var dataBucket = undefined;
            //console.log(currentSchema.systemType);
            switch (currentSchema.systemType) {
                case 'ForeignId':
                    dataBucket = foreignIdRelationData;
                    break;
                case 'HelperSetItemId':
                    dataBucket = helperSetItemIdRelationData;
                    break;
                case 'CustomRecordTypeKey':
                    dataBucket = customRecordTypeRelationData;
                    break;
            }

            if (dataBucket) {
                dataBucket.push({
                    ...currentSchema.systemProps,
                    dataPointer: fullDataPointer,
                    value: currentData,
                });
            }
            //console.log(currentData);
        }
    });
    return {
        foreignIdRelationData,
        helperSetItemIdRelationData,
        customRecordTypeRelationData,
    };
}

module.exports = resolveRelationData;
