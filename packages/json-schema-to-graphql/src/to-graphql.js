'use strict';
var toPascalCase = require('pascal-case').pascalCase;

module.exports = ({
    schema,

    jsonSchemaIdToGraphqlRootTypeMap,
    jsonSchemaIdToJsonSchemaDefinitionMap,
}) => {
    var result = '';

    var id = schema['$id'],
        type = schema.type,
        graphqlRootType = jsonSchemaIdToGraphqlRootTypeMap[id];

    if (!graphqlRootType) {
        //throw somethign
    }

    if (type === 'array') {
        // NOTE: type MyArray = [String] is not a thing in
        // graphql ... it doesnt even work with unions
        throw new Error('graphql does not suport top level array types');
    }

    if (type === 'object') {
        var stack = [{
            json: schema,
            graphqlParentType: graphqlRootType,
        }];

        while (stack.length > 0) {
            var { json, graphqlParentType } = stack.pop();

            if (!result[graphqlParentType]) {
                result[graphqlParentType] = {};
            }

            var body = '';
            
            var isRequired = false,
                definitions = json.items || json.properties;

            Object.keys(definitions)
                .map(key => ({ key, definition: definitions[key]}))
                .forEach(({ key, definition }) => {
                    var jsonType = definition.type,
                        graphqlType = undefined;

                    if (jsonType === 'object' || jsonType === 'array') {
                        graphqlType = (
                            `${graphqlParentType}${toPascalCase(key)}`
                        );
                        
                        stack.push({
                            json: definition,
                            graphqlParentType: graphqlType
                        });
                        
                        if (proptype === 'array') {
                            if (
                                items.type === 'object' ||
                                items.type === 'array'
                            ) {
                                result[graphqlParentType][key] = (
                                    `[${graphqlType}]`
                                );
                            }
                            else {
                                result[graphqlParentType][key] = (
                                    `[${transformPrimitive(proptype)}]`
                                );
                            }

                        }
                        else {
                            stack.push({
                                json: property,
                                graphqlParentType: graphqlType
                            });
                        }
                    }
                    else {
                        result[graphqlParentType][key] = (
                            transformPrimitive(proptype)
                        );
                    }
                });
        }

    }
    else {
        
    }
    
    return result;
};

var transformPrimitive = (proptype) => (
    ({
        'integer': 'Int',
        'number': 'Float',
        'boolean': 'Boolean',
        'string': 'String',
    })[proptype] || 'String'
);
