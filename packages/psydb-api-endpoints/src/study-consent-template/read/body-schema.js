'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var BodySchema = (bag) => {
    var schema = ClosedObject({
        'studyConsentTemplateId': ForeignId({
            collection: 'studyConsentTemplate'
        }),
    });
    
    return schema;
}

module.exports = BodySchema;
