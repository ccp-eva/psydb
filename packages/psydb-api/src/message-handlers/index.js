'use strict';
//module.exports = require('./registry');

var allHandlers = [
    //require('./handlers/helper-set-items'),
    //require('./handlers/helper-sets'),
    require('./handlers/records'),
    require('./handlers/set-personnel-password'),
];

module.exports = allHandlers;
