'use strict';
var { ClosedObject, ForeignId, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var { StudyEmailTemplate } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyId': ForeignId({ collection: 'study' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'props': StudyEmailTemplate.State(),
    });
    
    return schema;
}

module.exports = Schema;
