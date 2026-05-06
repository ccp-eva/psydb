'use strict';
var { ClosedObject, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var State = require('./state');

var MongoDoc = (context) => {
    var schema = ClosedObject({
        'studyType': CustomRecordTypeKey({ collection: 'study' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'props': State(),
    });
    
    return schema;
}

module.exports = MongoDoc;
