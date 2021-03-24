'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var StudyGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'study',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'study',
        op: 'patch',
    }),
]);

// TODO
/*var StudyGroup = MessageHandlerGroup([
    // creates new record and add core attributes
    // such as name etc (all custom record props)
    require('./create-core'),
    // patch core attributes of the study
    require('./patch-core'),

    // add a subject type that may hold conditions and can be
    // tested in this study
    require('./add-subject-type'),
    // removes subject type 
    require('./remove-subject-type'),

    // adds a condition that must be met by testable subjects
    // used when searching for testable subjects
    require('./add-search-condition'),
    // updates existing search condition for example
    // when required values are changed
    require('./update-search-condition'),
    // remove an existing search condition
    require('./remove-search-condition'),

    // commits changes to subject types and conditions
    require('./commit-types-and-conditions'),
    // resets uncommited changes to types and conditions
    require('./reset-types-and-conditions'),

    // deletes study record that has never been commited
    // and is flagged as "isNew"
    require('./cancel-create'),
]);*/

module.exports = StudyGroup;
