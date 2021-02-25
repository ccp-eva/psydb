'use strict';
var MessageHandlerGroup = require('../../lib/message-handler-group');

var CustomTypeGroup = MessageHandlerGroup([
    require('./create'),
    require('./add-field-definition'),
    require('./set-record-label-definition'),
    require('./commit-settings'),
]);

module.exports = CustomTypeGroup;
