'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ExperimentGroup = MessageHandlerGroup([
    require('./create-from-awayteam-reservation'),
    require('./create-from-inhouse-reservation'),
    require('./create-from-online-video-call-reservation'),
    
    require('./change-experiment-operator-team'),
    require('./change-invitation-status'),
    require('./change-participation-status'),
    require('./change-per-subject-comment'),
    
    require('./move-inhouse'),
    require('./move-subject-inhouse'),

    require('./move-away-team'),

    require('./add-subject'),
    require('./remove-subject'),
]);

module.exports = ExperimentGroup;
