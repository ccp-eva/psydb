'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix'),
    systemPermissionsSchema = require('../system-permissions-schema');

var {
    ForeignId,
    EmailList,
    PhoneList,
    Address,
    FullText,
    SaneString,
    SpecialHumanName,
} = require('@mpieva/psydb-schema-fields');

var PersonnelGdprState = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/gdpr/state`,
        type: 'object',
        properties: {
            name: SpecialHumanName(),
            // TODO: decide if that should be stored in the scientific part
            shorthand: SaneString(),
            // TODO: find out if thats even needed
            address: Address({
                required: []
            }),
            emails: EmailList({
                minItems: 1
            }),
            phones: PhoneList({
                minItems: 1
            }),
            // TODO: find out what thats good for
            description: FullText(),
            systemPermissions: systemPermissionsSchema,
            internals: {
                type: 'object',
                properties: {
                    passwordHash: {
                        type: 'string',
                    },
                },
                required: [
                    'passwordHash'
                ],
            },
        },
        required: [
            'lastname',
            'firstname',
            'shorthand',
            'emails',
            'phones',
            'systemPermissions',
            'internals',
        ],
    }

    return schema;
};

module.exports = PersonnelGdprState;
