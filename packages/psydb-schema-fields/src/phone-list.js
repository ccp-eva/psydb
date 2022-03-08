'use strict';
var Phone = require('./phone');

var PhoneList = ({ title, minItems }) => ({
    title: title,
    systemType: 'PhoneList',
    type: 'array',
    default: [],
    minItems: (minItems || 0),
    items: Phone({
        title: 'Nummer'
    })
})

module.exports = PhoneList;
