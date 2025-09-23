'use strict';
var { ClosedObject, ForeignId, SaneString }
    = require('@mpieva/psydb-schema-fields');

var Schema = (context) => {
    var schema = ClosedObject({
        'studyId': ForeignId({ collection: 'study' }),
        'confirmation': SaneString({ minLength: 1 }),
    });

    return schema;
}

module.exports = Schema;
