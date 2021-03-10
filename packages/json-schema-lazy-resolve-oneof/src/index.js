'use strict';
var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer');

var PointerMapping = require('./pointer-mapping');

var lazyResolve = (schema, data) => {
    // this wrapper enables us to replace the schema root if required
    var evilRefHack = { schema };

    var pointerMapping = PointerMapping();
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

    console.log(pointerMapping);

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
