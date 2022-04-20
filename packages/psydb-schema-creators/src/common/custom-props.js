'use strict';
var fields = require('@mpieva/psydb-schema-fields');

var CustomProps = ({ customFieldDefinitions }) => {
    customFieldDefinitions = customFieldDefinitions || [];

    var schemaProperties = {};
    for (var definition of customFieldDefinitions) {
        var { key, type, displayName, props } = definition;
        
        //console.log(key, type);
        
        schemaProperties[key] = (
            fields[type]({ title: displayName, ...props })
        );
    }

    //console.dir(schemaProperties, { depth: null });

    //throw new Error();

    var schema = fields.ExactObject({
        properties: schemaProperties,
        required: Object.keys(schemaProperties),
    });

    //console.dir(schema, { depth: null });
    return schema;
}

module.exports = CustomProps;
