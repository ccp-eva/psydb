'use strict';
var Address = () => ({
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
