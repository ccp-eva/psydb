'use strict';
var {
    Address,
    EmailList,
    PhoneList,
    BlockedWeekdays,
    FullText,
} = require('@mpieva/psydb-schema-fields');

var id = 'psy-db/location/external-building/baserecord',
    ref = { $ref: `${id}#` };

var ExternalBuilding = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'external-building' },
        subtype: { enum: [
            // for future use, i.e school
            'kindergarden',
        ]},
        name: { type: 'string' },
        parentOrganizationId: ExternalOrganizationId(),
        address: Address(),
        emails: EmailList({ minItems: 1 }),
        phones: PhoneList({ minItems: 1 }),
        fax: {
            type: 'string',
            format: 'phone-number', // custom format
        },

        contactPersons: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    role: {
                        type: { enum: [
                            'head',
                            'deputy',
                            'other'
                        ]},
                        default: 'other',
                    },
                    required: [
                        'name',
                        'role'
                    ],
                },
            }
        },

        blockedWeekdays: BlockedWeekdays(),
        description: FullText(),
        isHidden: { type: 'boolean' },

        // FIXME: is that actually used and for what?
        testRoomName: { type: 'string' },
    },
    required: [
        'type',
        'subtype',
        'name',
        'parentOrganizationId',
        'address',
        'emails',
        'phones',
        'contactPersons',
        'blockedWeekdays',
    ],
}

module.exports = {
    id,
    ref,
    schema: ExternalBuilding,
}
