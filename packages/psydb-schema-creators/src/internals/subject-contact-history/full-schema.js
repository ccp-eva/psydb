'use strict';
var { ClosedObject, Id, CustomRecordTypeKey, ForeignId, StringEnum, DateTime }
    = require('@mpieva/psydb-schema-fields');
var internals = require('../');

var FullSchema = (bag) => ClosedObject({
    '_id': Id(),
    'type': StringEnum([' email' ]),
    'subjectType': CustomRecordTypeKey({ collection: 'subject' }),
    'subjectId': ForeignId({ collection: 'subject' }),
    'contactedAt': DateTime(),
    'contactedBy': ForeignId({ collection: 'personnel', isNullable: true  }),
    'state': internals.SubjectContactHistoryState(bag)
});

module.exports = FullSchema;
