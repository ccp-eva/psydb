'use strict';
var MessageHandlerGroup = require('../../lib/message-handler-group');

var HelperSetItemsGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = HelperSetItemsGroup;
