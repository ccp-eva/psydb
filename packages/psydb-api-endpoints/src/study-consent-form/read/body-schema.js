'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var BodySchema = (bag) => {
    var schema = ClosedObject({
        'studyConsentFormId': ForeignId({ collection: 'studyConsentForm' }),
    });
    
    return schema;
}

module.exports = BodySchema;
