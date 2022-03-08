'use strict';
var Phone = require('./phone');

var PhoneList = ({ minItems }) => ({
    title: 'Telefon',
    systemType: 'PhoneList',
    type: 'array',
    default: [],
    minItems: (minItems || 0),
    items: Phone({
        title: 'Nummer'
    })
})

module.exports = PhoneList;
