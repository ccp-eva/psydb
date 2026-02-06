'use strict';
var {
    ClosedObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');


var Schema = async (context) => {
    var schema = ClosedObject({
        sourceSubjectId: ForeignId({ collection: 'subject' }),
        targetSubjectId: ForeignId({ collection: 'subject' }),
    });
    
    return schema;
}

module.exports = Schema;
