'use strict';
var {
    ClosedObject,
    ForeignId,
    ForeignIdList,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var schema = ClosedObject({
        studyId: ForeignId({ collection: 'study' }),
        subjectIds: ForeignIdList({ collection: 'subject' }),
        mailSubject: SaneString(),
        mailBody: { type: 'string' }, // XXX
    });
    return schema;
}

module.exports = Schema;
