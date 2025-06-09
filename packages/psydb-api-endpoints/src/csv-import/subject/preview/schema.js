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
        'researchGroupId': ForeignId({ collection: 'researchGroup' }),
    });

    return schema;
}

module.exports = Schema;
