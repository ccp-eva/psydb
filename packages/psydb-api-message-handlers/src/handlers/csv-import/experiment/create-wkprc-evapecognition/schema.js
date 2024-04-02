'use strict';
var {
    ClosedObject,
    ForeignId,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var Schema = (context) => {
    var schema = ClosedObject({
        'fileId': ForeignId({ collection: 'file' }),
        'locationId': ForeignId({ collection: 'location' }),
        'studyId': ForeignId({ collection: 'study' }),
        'labOperatorIds': ForeignIdList({ collection: 'pesonnel' }),
    });

    return schema;
}

module.exports = Schema;
