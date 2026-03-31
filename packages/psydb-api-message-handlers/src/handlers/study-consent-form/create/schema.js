'use strict';
var { ClosedObject, ForeignId, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var { StudyConsentForm } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyId': ForeignId({ collection: 'study' }),
        'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
        'props': StudyConsentForm.State(),
    });
    
    return schema;
}

module.exports = Schema;
