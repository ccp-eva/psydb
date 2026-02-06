'use strict';
var {
    ClosedObject,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');


var Schema = async (context) => {
    var schema = ClosedObject({
        subjectIds: ForeignIdList({ collection: 'subject' }),
    });
    
    return schema;
}

module.exports = Schema;
