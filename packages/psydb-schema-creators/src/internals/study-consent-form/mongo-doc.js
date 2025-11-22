'use strict';
var { ClosedObject, ForeignId, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var State = require('./state');

var MongoDoc = (context) => {
    var schema = ClosedObject({
        'studyId': ForeignId({ collection: 'study' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'props': State(),
    });
    
    return schema;
}

module.exports = MongoDoc;
