'use strict';
var { ClosedObject, ForeignId, StringEnum, DateTime, SaneString }
    = require('@mpieva/psydb-schema-fields');

var Schema = (context) => {
    var schema = ClosedObject({
        'subjectId': ForeignId({ collection: 'subject' }),
        'props': ClosedObject({
            'type': StringEnum([ 'email', 'phone' ]),
            'contactedAt': DateTime(),
            'contactedBy': ForeignId({
                collection: 'personnel', isNullable: true
            }),
            'status': StringEnum([
                'sent', 'delivered',
                'contact-successful', 'mailbox', 'contact-failed',
            ]),
            'comment': SaneString(),
        }),
    });

    return schema;
}

module.exports = Schema;
