'use strict';
var ExactObject = require('./exact-object'),
    SaneString = require('./sane-string');

var Address = ({
    required,
    ...additionalProperties
} = {}) => {
    required = required || [
        'country',
        'city',
        'postcode',
        'street',
        'housenumber'
    ];

    return ExactObject({
        systemType: 'Address',
        properties: {
            // country should be code from countries-list npm package
            country: {
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Land',
                enum: [ 'DE' ],
                default: 'DE',
            },
            city: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Ort',
                type: 'string',
                default: '',
                minLength: required.includes('city') ? 2 : 0,
            }),
            postcode: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'PLZ',
                type: 'string',
                default: '',
                minLength: required.includes('postcode') ? 2 : 0,
            }),
            street: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Straße',
                type: 'string',
                default: '',
                minLength: required.includes('street') ? 2 : 0,
            }),
            housenumber: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Nummer',
                type: 'string',
                default: '',
                minLength: required.includes('housenumber') ? 2 : 0,
            }),
            affix: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Zusatz',
                type: 'string',
                default: '',
                minLength: required.includes('affix') ? 2 : 0,
            }),
        },
        ...additionalProperties,
    })
};

module.exports = Address;
