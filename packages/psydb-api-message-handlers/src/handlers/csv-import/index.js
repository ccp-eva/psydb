'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var CSVImportGroup = MessageHandlerGroup([
    require('./create-online-participation-import'),
    require('./experiment/create-wkprc-evapecognition'),
    require('./experiment/create-manual-only-participation'),
    require('./experiment/create-online-survey'),
    require('./subject/create-default'),
]);

module.exports = CSVImportGroup;
