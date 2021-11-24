'use strict';

var allHandlers = [
    require('./handlers/self'),

    require('./handlers/helper-set-items'),
    require('./handlers/helper-sets'),
    require('./handlers/custom-record-types'),
    //require('./handlers/records'),
    require('./handlers/set-personnel-password'),
    
    require('./handlers/system-role'),
    require('./handlers/personnel'),
    require('./handlers/research-group'),
    require('./handlers/location'),
    
    require('./handlers/subject'),
    require('./handlers/subject-selector'),
    require('./handlers/age-frame'),

    require('./handlers/study'),
    require('./handlers/study-topic'),
    require('./handlers/experiment-operator-team'),

    require('./handlers/reservation'),
    require('./handlers/experiment'),
    require('./handlers/experiment-variant'),
    require('./handlers/experiment-variant-setting'),
    
    require('./handlers/external-organization'),
    require('./handlers/external-person'),
];

module.exports = allHandlers;
