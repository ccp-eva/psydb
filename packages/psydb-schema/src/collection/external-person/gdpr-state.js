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
    SaneString,
    SpecialHumanName,
} = require('@mpieva/psydb-schema-fields');

var ExternalPersonGdprState = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}/gdpr/state`,
        type: 'object',
        properties: {
            salutation: SaneString(),
            name: SpecialHumanName(),
            address: Address(),
            emails: EmailList({ minItems: 1 }),
            phones: PhoneList({ minItems: 1 }),
            description: FullText(),
        },
        required: [
            'salutation',
            'name',
            'address',
            'emails',
            'phones',
            'description',
        ],
    }

    return schema;
};

module.exports = ExternalPersonGdprState;
