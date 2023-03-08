'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var CSVImportGroup = MessageHandlerGroup([
    require('./create-online-participation-import')
]);

module.exports = CSVImportGroup;
