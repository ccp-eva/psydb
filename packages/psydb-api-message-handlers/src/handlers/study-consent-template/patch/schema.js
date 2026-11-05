'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { StudyConsentTemplate } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyConsentTemplateId': ForeignId({
            collection: 'studyConsentTemplate'
        }),
        'props': StudyConsentTemplate.State(),
    });
    
    return schema;
}

module.exports = Schema;
