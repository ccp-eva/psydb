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
        'locationType': CustomRecordTypeKey({ collection: 'location' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'studyId': ForeignId({ collection: 'study' }),
        'treatEachLineAsSeperateExperiment': DefaultBool(),
    });

    return schema;
}

module.exports = Schema;
