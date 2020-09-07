'use strict';
var toPascalCase = require('pascal-case').pascalCase,
    toGraphql = require('./to-graphql'),
    stringify = require('./stringify');

module.exports = (schemas) => {
    var jsonSchemaIdToGraphqlRootTypeMap = {},
        jsonSchemaIdToJsonSchemaDefinitionMap = {};

    Object.keys(schemas)
        .map(key => ({
            graphqlRootType: toPascalCase(key),
            schema: schemas[key]
        }))
        .forEach(({ graphqlRootType, schema }) => {
            var id = schema['$id'];
            if (!id) {
                // FIXME: what to do here? throw?
            }

            jsonSchemaIdToGraphqlRootTypeMap[id] = graphqlRootType;
            jsonSchemaIdToJsonSchemaDefinitionMap[id] = schema;
        });

    console.log(jsonSchemaIdToGraphqlRootTypeMap);
    console.log(jsonSchemaIdToJsonSchemaDefinitionMap);
    
    var result = (
        Object.keys(schemas)
        .reduce((acc, key) => ({
            ...acc,
            ...toGraphql({
                schema: schemas[key],

                jsonSchemaIdToGraphqlRootTypeMap,
                jsonSchemaIdToJsonSchemaDefinitionMap,
            })
        }), {})
    );

    return stringify(result);
}
