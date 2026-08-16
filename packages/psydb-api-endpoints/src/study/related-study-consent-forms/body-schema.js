'use strict';
var { ExactObject, ForeignId, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var BodySchema = (bag) => {
    var schema = ExactObject({
        properties: {
            'studyId': ForeignId({ collection: 'study' }),
            'subjectType': CustomRecordTypeKey({ collection: 'subject' })
        },
        required: [ 'studyId' ]
    })
    
    return schema;
}

module.exports = BodySchema;
