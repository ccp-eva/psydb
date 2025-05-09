'use strict';
var fields = require('@mpieva/psydb-schema-fields');

var fieldDefinitionsToSchema = (fieldDefinitions) => {
    console.log(fieldDefinitions);

    var schemaProperties = {};
    for (var definition of fieldDefinitions) {
        var { key, type, props } = definition;
        
        console.log(key, type);
        
        schemaProperties[key] = (
            fields[type](props)
        );
    }

    //console.dir(schemaProperties, { depth: null });

    //throw new Error();

    var schema = fields.ExactObject({
        properties: schemaProperties,
        required: Object.keys(schemaProperties),
    });

    return schema;
}

module.exports = fieldDefinitionsToSchema;
