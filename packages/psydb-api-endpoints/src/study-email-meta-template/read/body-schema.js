'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var BodySchema = (bag) => {
    var schema = ClosedObject({
        'studyEmailMetaTemplateId': ForeignId({
            collection: 'studyEmailMetaTemplate'
        }),
    });
    
    return schema;
}

module.exports = BodySchema;
