'use strict';

var allHandlers = [
    require('./handlers/helper-set-items'),
    require('./handlers/helper-sets'),
    require('./handlers/custom-record-types'),
    require('./handlers/records'),
    require('./handlers/set-personnel-password'),
    require('./handlers/reservation'),
    require('./handlers/experiment'),
];

module.exports = allHandlers;
