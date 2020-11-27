'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema');

var {
    ForeignId,
    Address,
    EmailList,
    PhoneList,
    FullText,
    SaneString
} = require('@mpieva/psydb-schema-fields');

var createExternalPersonScientificState = (key) => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/${key}/state`,
        type: 'object',
        properties: {
            type: { const: key },
            salutation: SaneString(),
            name: SpecialHumanName(),
            address: Address(),
            emails: EmailList({ minItems: 1 }),
            phones: PhoneList({ minItems: 1 }),
            description: FullText(),
            systemPermissions: systemPermissionsSchema,
            internals: {
                type: 'object',
                properties: {
                    externalPersonScientificId: (
                        ForeignId('externalPersonScientific')
                    ),
                },
                required: [
                    'externalPersonScientificId',
                ],
            }
        },
        required: [
            'type',
            'salutation',
            'name',
            'address',
            'emails',
            'phones',
            'description',
            'systemPermissions',
            'internals',
        ],
    }

    return schema;
};

module.exports = createExternalPersonScientificState;
