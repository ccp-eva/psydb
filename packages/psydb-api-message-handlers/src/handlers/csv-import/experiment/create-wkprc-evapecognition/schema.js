'use strict';
var {
    ClosedObject,
    ForeignId,
    ForeignIdList,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var Schema = (context) => {
    var schema = ClosedObject({
        'fileId': ForeignId({ collection: 'file' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'locationId': ForeignId({ collection: 'location' }),
        'studyId': ForeignId({ collection: 'study' }),
        'labOperatorIds': ForeignIdList({ collection: 'pesonnel' }),
    });

    return schema;
}

module.exports = Schema;
