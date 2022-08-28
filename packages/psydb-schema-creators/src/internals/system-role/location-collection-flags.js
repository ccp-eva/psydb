'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadLocations: WideBool({
        title: 'kann Locations einsehen (Kigas, Räume, etc.)'
    }),
    canWriteLocations: WideBool({
        title: 'kann Locations bearbeiten (Kigas, Räume, etc.)'
    }),
}
