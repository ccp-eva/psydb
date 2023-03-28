'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadLocations: WideBool(),
    canWriteLocations: WideBool(),
    canRemoveLocations: WideBool(),
}
