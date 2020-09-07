'use strict';
var toPascalCase = require('pascal-case').pascalCase;

module.exports = ({
    schema,

    jsonSchemaIdToGraphqlRootTypeMap,
    jsonSchemaIdToJsonSchemaDefinitionMap,
}) => {
    var result = {};

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

            Object.keys(json.properties)
                .map(key => ({ key, property: json.properties[key]}))
                .forEach(({ key, property }) => {
                    var proptype = property.type;

                    if (proptype === 'object' || proptype === 'array') {
                        var graphqlType = (
                            `${graphqlParentType}${toPascalCase(key)}`
                        );
                        
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
                            result[graphqlParentType][key] = graphqlType;
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
