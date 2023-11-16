'use strict';
var {
    ClosedObject,
    Id,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var internals = require('../');

var FullSchema = (bag) => ClosedObject({
    _id: Id(),
    subjectType: CustomRecordTypeKey({
        collection: 'subject'
    }),
    state: internals.SubjectGroupState(bag)
});

module.exports = FullSchema;
