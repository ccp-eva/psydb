'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { StudyConsentForm } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyConsentFormId': ForeignId({ collection: 'studyConsentForm' }),
        'props': StudyConsentForm.State(),
    });
    
    return schema;
}

module.exports = Schema;
