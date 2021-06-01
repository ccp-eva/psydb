'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

/*var StudyGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'study',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'study',
        op: 'patch',
    }),
]);*/

// TODO
var StudyGroup = MessageHandlerGroup([
    // creates new record and add core attributes
    // such as name etc (all custom record props)
    //require('./create-core'),
    // patch core attributes of the study
    //require('./patch-core'),

    GenericRecordHandler({
        collection: 'study',
        op: 'create',
    }),

    GenericRecordHandler({
        collection: 'study',
        op: 'patch',
    }),

    require('./add-external-location-field'),

    // add a subject type that may hold conditions and can be
    // tested in this study
    require('./add-subject-type'),
    // removes subject type 
    //require('./remove-subject-type'),

    require('./add-age-frame'),
    require('./update-age-frame'),
    //require('./remove-age-frame'),

    //require('./add-general-condition'),
    //require('./update-general-condition'),
    //require('./remove-general-condition'),
]);

module.exports = StudyGroup;
