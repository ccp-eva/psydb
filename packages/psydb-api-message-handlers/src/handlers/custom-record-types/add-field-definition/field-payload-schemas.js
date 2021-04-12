var FieldDefinitionSchemas = require('@mpieva/psydb-common-lib/src/field-definition-schemas');

// to make sure the paths match the real message structure
var wrapped = (definition) => () => ({
    type: 'object',
    properties: {
        payload: {
            type: 'object',
            properties: {
                props: definition(),
            }
        }
    }
})

var wrapped = Object.keys(FieldDefinitionSchemas).reduce((acc, key) => ({
    ...acc,
    [key]: wrapped(FieldDefinitionSchemas[key])
}), {});

module.exports = wrapped;
