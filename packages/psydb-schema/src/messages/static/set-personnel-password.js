'use strict';
var Message = require('../message');

var SetPersonnelPasswordMessage = Message({
    type: 'set-personnel-password',
    payload: {
        password: {
            type: 'string',
            minLength: 8
        }
    }
});

module.exports = SetPersonnelPasswordMessage;
