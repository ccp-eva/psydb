'use strict';
var { ClosedObject, ForeignId }
    = require('@mpieva/psydb-schema-fields');

var State = require('./state');

var MongoDoc = (context) => {
    var schema = ClosedObject({
        'studyId': ForeignId({ collection: 'study' }),
        'props': State(),
    });
    
    return schema;
}

module.exports = MongoDoc;
