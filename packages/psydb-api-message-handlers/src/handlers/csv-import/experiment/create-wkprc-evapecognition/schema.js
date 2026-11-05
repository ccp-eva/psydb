'use strict';
var {
    ClosedObject,
    ForeignId,
    CustomRecordTypeKey,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var Schema = (context) => {
    var schema = ClosedObject({
        'fileId': ForeignId({ collection: 'file' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'studyId': ForeignId({ collection: 'study' }),

        'skipPossibleDuplicates': DefaultBool(),
    });

    return schema;
}

module.exports = Schema;
