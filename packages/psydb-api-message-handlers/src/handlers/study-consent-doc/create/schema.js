'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var Schema = async (context) => {
    var schema = ClosedObject({
        'studyConsentFormId': ForeignId({ collection: 'studyConsentForm' }),
        'subjectId': ForeignId({ collection: 'subject' }),
        'props': { type: 'object' }, // XXX
    });
    
    return schema;
}

module.exports = Schema;
