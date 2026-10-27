'use strict';
var { ExactObject, ForeignId, SaneString, StringEnum }
    = require('@mpieva/psydb-schema-fields');


var CSVSchema = (bag = {}) => {
    var { subjectType } = bag;

    var required = {
        'subjectId': ForeignId({
            collection: 'subject', recordType: subjectType
        }),
        'contactType': StringEnum([ 'email', 'phone' ]),
        'date': DateYMD(),
        'contactedBy': ForeignId({ collection: 'personnel' }),
    };
    var optional = {
        'time': TimeHM(),
        'status': StringEnum([
            'sent', 'delivered',
            'contact-successful', 'mailbox', 'contact-failed',
        ]),
        'comment': SaneString(), // NOTE: no fulltext for now
    }

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required)
    });

    return schema;
}

// TODO: move
var DateYMD = (bag = {}) => {
    var schema = { ...bag, type: 'string', format: 'date-ymd-or-dmy' };
    return schema;
}

// TODO: move
var TimeHM = (bag = {}) => {
    var schema = { ...bag, type: 'string', format: 'time-hm' };
    return schema;
}

module.exports = CSVSchema;
