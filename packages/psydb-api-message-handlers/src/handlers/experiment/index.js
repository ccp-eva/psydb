'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ExperimentGroup = MessageHandlerGroup([
    require('./create-from-awayteam-reservation'),
    require('./create-from-inhouse-reservation'),
    require('./change-invitation-status'),
]);

module.exports = ExperimentGroup;
