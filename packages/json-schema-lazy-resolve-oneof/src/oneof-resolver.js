'use strict';
var debug = require('debug')('json-schema-lazy-resolve-oneof:OneofResolver');
var inline = require('@cdxoo/inline-text');

var OneofResolver = () => {
    var resolver = {},
        transformations = [];

    resolver.transformations = () => ([ ...transformations ]);

    resolver.resolve = ({
        currentData,
        traverseArgs,
    }) => {
        var [
            currentSchema,
            inSchemaPointer,
            rootSchema,
            parentInSchemaPointer,
            parentKeyword,
            parentSchema,
            propNameOrIndex
        ] = traverseArgs;

        if (currentData === undefined) {
            console.log(
                `skipping as data is undefined for ${inSchemaPointer}`
            );
            return;
        }

        if (!currentSchema.oneOf) {
            throw new Error(inline`
                oneOf keyword not found in "${inSchemaPointer}"
            `);
        }

        var lazyResolveProp = currentSchema.lazyResolveProp;
        if (!lazyResolveProp) {
            throw new Error(inline`
                no "lazyResolveProp" definition in "${inSchemaPointer}"
            `)
        }

        var lazyResolveDataValue = currentData[lazyResolveProp];

        var branches = currentSchema.oneOf,
            branchWasFound = false;
        for (var [index, branchSchema] of branches.entries()) {
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
            debug('erroneous data:', currentData);
            throw new Error(inline`
                no valid branch was found in pointer: "${inSchemaPointer}"
                for resolveProp "${lazyResolveProp}" with value
                "${lazyResolveDataValue}"
            `);
        }

    }

    return resolver;
};

var decide = ({
    schema,
    dataValue
}) => {
    var shouldUse = false;

    // FIXME: we should check if the key exists
    if (schema.const !== undefined) {
        var schemaValue = schema.const;
        if (schemaValue === dataValue) {
            shouldUse = true;
            //console.log(schema, dataValue);
            //console.log('shouldUSE CONST')
        }
    }
    else if (schema.enum) {
        var schemaValue = schema.enum;
        if (schemaValue.includes(dataValue)) {
            shouldUse = true;
            //console.log(schema, dataValue);
            //console.log('shouldUSE ENUM')
        }
    }
    else {
        throw new Error(inline`
            oneof resolver can only handle properties via "enum" or "const"
        `);
    }

    return shouldUse;
}

module.exports = OneofResolver;
