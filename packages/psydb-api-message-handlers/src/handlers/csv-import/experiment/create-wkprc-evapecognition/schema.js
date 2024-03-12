'use strict';
var {
    ClosedObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var Schema = (context) => {
    var schema = ClosedObject({
        'fileId': ForeignId({ collection: 'file' }),
        'locationId': ForeignId({ collection: 'location' }),
        'studyId': ForeignId({ collection: 'study' }),
    });

    return schema;
}

module.exports = Schema;
