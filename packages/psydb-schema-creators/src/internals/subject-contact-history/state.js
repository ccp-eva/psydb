'use strict';
var { ClosedObject, StringEnum, SaneString }
    = require('@mpieva/psydb-schema-fields');

var SubjectContactHistoryState = (bag = {}) => {
    var schema = ClosedObject({
        'status': StringEnum([
            'sent', 'delivered',
            'contact-successful', 'mailbox', 'contact-failed',
        ]),
        'comment': SaneString(), // NOTE: no full text for now
    }, { systemType: 'SubjectContactHistoryState' })

    return schema;
}

module.exports = SubjectContactHistoryState;
