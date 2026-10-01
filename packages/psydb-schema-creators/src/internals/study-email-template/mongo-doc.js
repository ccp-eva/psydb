'use strict';
var { ClosedObject, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var State = require('./state');

var MongoDoc = (context) => {
    var schema = ClosedObject({
        'studyId': CustomRecordTypeKey({ collection: 'study' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'state': State(),
    });
    
    return schema;
}

module.exports = MongoDoc;
