'use strict';
var Address = require('../../fields/address').ref,
    PhoneNumber = require('../../fields/phone-number').ref,
    BlockedWeekdays = require('../../fields/blocked-weekdays').ref,
    FullText = require('../../fields/full-text').ref;

var id = 'psy-db/external-person/doctor/baserecord',
    ref = { $ref: `${id}#` };

var Doctor = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    properties: {
        type: { const: 'doctor' },
        name: { type: 'string' },
        address: Address,
        emails: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'string',
                format: 'email'
            },
        },
        phones: {
            type: 'array',
            minItems: 1,
            items: PhoneNumber,
        },
        fax: PhoneNumber,

        description: FullText,
        isHidden: { type: 'boolean' },
    },
    required: [
        'type',
        'name',
        'address',
        'emails',
        'phones',
    ]
}

module.exports = {
    id,
    ref,
    schema,
}
