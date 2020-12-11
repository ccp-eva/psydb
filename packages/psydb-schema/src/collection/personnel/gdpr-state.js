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
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var PersonnelGdprState = () => {
    var schema = ExactObject({
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/gdpr/state`,
        type: 'object',
        additionalProperties: false, // TODO: this needs to be everywhere
        properties: {
            name: SpecialHumanName(),
            // TODO: decide if that should be stored in the scientific part
            //shorthand: SaneString(),
            shorthand: SaneString({ minLength: 2 }),
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
            // TODO: internals need to be separated
            // and put here when we read the record
            // but as they cant be written
            // ... not sure if that works when
            // we use prohibited though
            // => this works but the errors are
            // wierd, and im still not fully convinced
            // by the general approach
            // TODO: prohibited keyword should give
            // reasonable error message
            internals: ExactObject({
                properties: {
                    passwordHash: {
                        type: 'string',
                        default: '',
                    },
                },
                required: [
                    'passwordHash'
                ],
            }),
        },
        required: [
            'name',
            'shorthand',
            'emails',
            'phones',
        ],
        prohibited: [
            'internals',
        ],
    })

    return schema;
};

module.exports = PersonnelGdprState;
