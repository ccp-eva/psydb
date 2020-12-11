'use strict';
var ExactObject = require('./exact-object');

var Address = ({
    required
} = {}) => ExactObject({
    properties: {
        // country should be code from countries-list npm package
        country: {
            enum: [ 'DE' ],
            default: 'DE',
        },
        city: {
            type: 'string',
            default: '',
        },
        postcode: {
            type: 'string',
            default: '',
        },
        street: {
            type: 'string',
            default: '',
        },
        housenumber: {
            type: 'string',
            default: '',
        },
        affix: {
            type: 'string',
            default: '',
        },
    },
    required: required || [
        'country',
        'city',
        'postcode',
        'street',
        'housenumber'
    ]
})

module.exports = Address;
