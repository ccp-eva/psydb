'use strict';
var {
    ClosedObject,
    ForeignId,
    CustomRecordTypeKey,
    StringEnum
} = require('@mpieva/psydb-schema-fields');

var Schema = (bag = {}) => {
    return ClosedObject({
        studyId: ForeignId({ collection: 'study' }),
        subjectType: CustomRecordTypeKey({ collection: 'subject' }),
        importType: StringEnum([ 'experiment', 'subject' ])
    })
}

module.exports = Schema;
