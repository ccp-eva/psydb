'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyConsentTemplateId': ForeignId({ collection: 'studyConsentTemplate' }),
    });
    
    return schema;
}

module.exports = Schema;
