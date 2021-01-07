'use strict';
var MessageHandlerGroup = require('../../lib/message-handler-group');

var HelperSetsGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = HelperSetsGroup;
