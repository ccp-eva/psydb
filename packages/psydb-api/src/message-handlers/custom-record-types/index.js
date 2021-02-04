'use strict';
var MessageHandlerGroup = require('../../lib/message-handler-group');

var CustomTypeGroup = MessageHandlerGroup([
    require('./create'),
    require('./add-field-definition'),
    require('./commit-field-definitions'),
]);

module.exports = CustomTypeGroup;
