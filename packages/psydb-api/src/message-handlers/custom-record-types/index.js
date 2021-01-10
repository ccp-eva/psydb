'use strict';
var MessageHandlerGroup = require('../../lib/message-handler-group');

var CustomTypeGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = CustomTypeGroup;
