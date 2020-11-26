'use strict';
var prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema'),
    internalsSchema = require('./internals-schema');

var createAnimalState = (key, customInnerSchema) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/animal/${key}/state`,
        type: 'object',
        properties: {
            type: { const: 'animal' },
            subtype: { const: key },
            custom: customInnerSchema,
            systemPermissions: systemPermissionsSchema,
            internals: internalsSchema,
        }
    }

    return schema;
};

module.exports = createAnimalState;
