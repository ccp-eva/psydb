'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyConsentFormId': ForeignId({ collection: 'studyConsentForm' }),
    });
    
    return schema;
}

module.exports = Schema;
