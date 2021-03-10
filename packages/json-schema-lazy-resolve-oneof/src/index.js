'use strict';
var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer');

var convertToDataPointer = (schemaPointer) => {
    // properties(.*) => (.*)
}

var lazyResolve = (schema, data) => {
    var evilRefHack = { schema };
    // FIXME: this is the most navie appraoch i guess
    var pointerMapping = {
        '': '', // for root schema pointer
    };
    var transformations = [];

    traverse(schema, { allKeys: false }, (
        currentSchema,
        inSchemaPointer,
        rootSchema,
        parentInSchemaPointer,
        parentKeyword,
        parentSchema,
        propNameOrIndex
    ) => {

        updatePointerMapping({
            pointerMapping,
            parentInSchemaPointer,
            inSchemaPointer,
            propNameOrIndex,
        });

        var dataPointer = pointerMapping[inSchemaPointer];
        var currentData = jsonpointer.get(data, dataPointer);

        if (currentSchema.oneOf) {

            var lazyResolveProp = currentSchema.lazyResolveProp;
            if (!lazyResolveProp) {
                throw new Error(inline`
                    no "lazyResolveProp" definition in "${inSchemaPointer}"
                `)
            }

            var branches = currentSchema.oneOf,
                branchWasFound = false;
            for (var [index, branchSchema] of branches.entries()) {
                console.log(branchSchema);
                
                var lazyResolveDataValue = data[lazyResolveProp];
                var lazyResolveSchema = (
                    branchSchema.properties[lazyResolveProp]
                );
                
                var shouldUseBranch = decide({
                    schema: lazyResolveSchema,
                    dataValue: lazyResolveDataValue
                });

                if (shouldUseBranch && branchWasFound) {
                    throw new Error(inline`
                        multiple matching branches found in path
                        "${inSchemaPointer}"
                    `);
                }

                if (shouldUseBranch) {
                    branchWasFound = true;
                    transformations.push({
                        from: inSchemaPointer,
                        to: `${inSchemaPointer}/oneOf/${index}`
                    })
                }
            }

            if (!branchWasFound) {
                throw new Error(inline`
                    no valid branch was found in ${inSchemaPointer}
                `);
            }

        }

    });

    for (var i = transformations.length - 1; i >= 0; i -= 1) {
        var { from, to } = transformations[i];
        from = `/schema${from}`;
        to = `/schema${to}`;

        console.log(from, to);

        jsonpointer.set(
            evilRefHack,
            from,
            jsonpointer.get(evilRefHack, to)
        );
    }

    return evilRefHack.schema;
}

var updatePointerMapping = ({
    pointerMapping,
    parentInSchemaPointer,
    inSchemaPointer,
    propNameOrIndex,
}) => {
    var mappedParentPointer = pointerMapping[parentInSchemaPointer];
    if (
        pointerMapping[inSchemaPointer] === undefined
    ) {
        var shouldAppendPropName = (
            // FIXME: this might be evil
            // oneOf/allOf have numbers in this parameter
            // real property key are always strings i.e.
            // { [1]: 'foo' } => { '1': 'foo' }
            typeof propNameOrIndex === 'string'
        )
        pointerMapping[inSchemaPointer] = (
            shouldAppendPropName
            ? mappedParentPointer + '/' + propNameOrIndex
            : mappedParentPointer
        )
    }
}

var decide = ({
    schema,
    dataValue
}) => {
    var shouldUse = false;

    if (schema.enum) {
        var schemaValue = schema.enum;
        if (schemaValue.includes(dataValue)) {
            shouldUse = true;
        }
    }
    else if (schema.const) {
        var schemaValue = schema.const;
        if (schemaValue === dataValue) {
            shouldUse = true;
        }
    }

    return shouldUse;
}

module.exports = lazyResolve;
