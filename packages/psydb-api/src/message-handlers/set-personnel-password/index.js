'use strict';
var handleMessage = require('./handle-message'),
    schema = require('./schema'),
    isAllowed = require('./is-allowed');

module.exports = {
    type: 'set-personnel-password',
    isAllowed,
    schema,
    handleMessage
};
