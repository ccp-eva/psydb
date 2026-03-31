'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var BodySchema = (bag) => {
    var schema = ClosedObject({
        'experimentId': ForeignId({ collection: 'experiment' }),
        'subjectId': ForeignId({ collection: 'subject' }),
    });
    
    return schema;
}

module.exports = BodySchema;
