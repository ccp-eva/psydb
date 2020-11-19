'use strict';
var Address = () => ({
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    type: 'object',
    reactType: 'address',
    properties: {
        // country should be code from countries-list npm package
        country: { type: { enum: [ 'DE' ] }},
        city: { type: 'string' },
        postcode: { type: 'string' },
        street: { type: 'string' },
        housenumber: { type: 'string' },
        affix: { type: 'string' },
    },
    required: [
        'country',
        'city',
        'postcode',
        'street',
        'housenumber'
    ]
})

module.exports = Address;
