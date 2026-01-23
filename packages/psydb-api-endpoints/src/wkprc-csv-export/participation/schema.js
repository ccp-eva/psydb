'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var schema = ClosedObject({
        studyId: ForeignId({ collection: 'study' }),
        subjectType: { type: 'string' } //XXX
    });
    return schema;
}

module.exports = Schema;
