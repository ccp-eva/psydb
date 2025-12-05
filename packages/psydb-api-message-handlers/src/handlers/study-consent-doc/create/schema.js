'use strict';
var { ExactObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var Schema = async (context) => {
    var required = {
        'studyConsentFormId': ForeignId({ collection: 'studyConsentForm' }),
        'subjectId': ForeignId({ collection: 'subject' }),
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

module.exports = Schema;
