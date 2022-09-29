'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ExperimentGroup = MessageHandlerGroup([
    require('./create-from-awayteam-reservation'),
    require('./create-from-inhouse-reservation'),
    require('./create-from-online-video-call-reservation'),
    
    require('./create-followup-awayteam'),

    require('./change-study'),
    require('./change-experiment-operator-team'),
    require('./change-invitation-status'),
    require('./change-participation-status'),
    require('./change-per-subject-comment'),
    require('./change-comment'),
    
    require('./move-inhouse'),
    require('./move-online-video-call'),
    require('./move-away-team'),
    
    require('./cancel-away-team'),

    require('./move-subject-inhouse'),
    require('./move-subject-online-video-call'),

    require('./followup-awayteam-move-to-placeholder'),
    require('./followup-subject-inhouse'),
    require('./followup-subject-online-video-call'),

    require('./add-subject'),
    require('./remove-subject'),
    require('./remove-subject-manual'),
    require('./auto-process-subjects'),
]);

module.exports = ExperimentGroup;
