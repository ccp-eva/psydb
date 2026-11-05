'use strict';
var { ClosedObject, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var { StudyEmailMetaTemplate } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyType': CustomRecordTypeKey({ collection: 'study' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'props': StudyEmailMetaTemplate.State(),
    });
    
    return schema;
}

module.exports = Schema;
