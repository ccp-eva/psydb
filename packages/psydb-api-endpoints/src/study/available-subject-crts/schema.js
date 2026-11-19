'use strict';
var {
    ClosedObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var Schema = (bag = {}) => {
    return ClosedObject({
        studyId: ForeignId({ collection: 'study' }),
    })
}

module.exports = Schema;
