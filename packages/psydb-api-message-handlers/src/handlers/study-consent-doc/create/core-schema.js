'use strict';
var { ExactObject, ForeignId, ForeignIdList }
    = require('@mpieva/psydb-schema-fields');

var CoreSchema = () => {
    var required = {
        'studyConsentFormId': ForeignId({ collection: 'studyConsentForm' }),
        'subjectId': ForeignId({ collection: 'subject' }),
        'labOperatorIds': ForeignIdList({
            collection: 'personnel', minItems: 1
        }),
        'props': { type: 'object' }, // XXX
    }
    var optional = {
        'experimentId': ForeignId({ collection: 'experiment' })
    }

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required),
    });
    
    return schema;
}

module.exports = CoreSchema;
