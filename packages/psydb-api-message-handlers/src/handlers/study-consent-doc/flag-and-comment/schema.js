'use strict';
var { ClosedObject, ForeignId, ExtBool, FullText }
    = require('@mpieva/psydb-schema-fields');

var Schema = async (context) => {

    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'studyConsentDoc' }),
        'props': ClosedObject({
            'hasIssue': ExtBool(),
            'containsSubjectUpdate': ExtBool(),
            'comment': FullText(),
        })
    });
    
    return schema;
}

module.exports = Schema;
