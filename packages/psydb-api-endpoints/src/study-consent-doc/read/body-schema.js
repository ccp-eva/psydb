'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var BodySchema = (bag) => {
    var schema = ClosedObject({
        'studyConsentDocId': ForeignId({ collection: 'studyConsentDoc' }),
    });
    
    return schema;
}

module.exports = BodySchema;
