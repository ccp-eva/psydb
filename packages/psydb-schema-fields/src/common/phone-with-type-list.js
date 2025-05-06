'use strict';
var { ExactObject } = require('../core-compositions');
var Phone = require('./phone');

var PhoneWithTypeList = ({ minItems, numbertypes, numbertypeNames }) => ({
    title: 'Telefon',
    systemType: 'PhoneWithTypeList',
    type: 'array',
    default: [],
    minItems: (minItems || 0),
    items: ExactObject({
        systemType: 'PhoneWithTypeListItem',
        properties: {
            number: Phone({
                title: 'Nummer',
            }),
            type: {
                title: 'Typ',
                type: 'string',
                enum: (numbertypes || [
                    'business',
                    'private',
                    'mobile', // is that still a thing?
                    'fax', // is this still a thing?

                    'mother', // TODO: we need to make this controllable
                    'father', // this too
                ]),
                enumNames: (numbertypeNames || [
                    'geschäftlich',
                    'privat',
                    'mobil',
                    'Fax',
                    'Tel. Mutter',
                    'Tel. Vater'
                ])
            }
        },
        required: [
            'number',
            'type'
        ]
    }),
})

module.exports = PhoneWithTypeList;
