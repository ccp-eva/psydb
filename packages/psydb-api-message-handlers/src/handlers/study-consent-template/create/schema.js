'use strict';
var { ClosedObject, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var { StudyConsentTemplate } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyType': CustomRecordTypeKey({ collection: 'study' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'props': StudyConsentTemplate.State(),
    });
    
    return schema;
}

module.exports = Schema;
