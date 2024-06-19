'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var CSVImportGroup = MessageHandlerGroup([
    require('./create-online-participation-import'),
    require('./experiment/create-wkprc-evapecognition'),
    require('./subject/create-default'),
]);

module.exports = CSVImportGroup;
