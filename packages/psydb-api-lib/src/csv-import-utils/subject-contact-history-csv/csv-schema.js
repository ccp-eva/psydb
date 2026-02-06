'use strict';
var { ExactObject, ForeignId, FullText, StringEnum }
    = require('@mpieva/psydb-schema-fields');


// NOTE: oneof whith phone type
// and status property with
// StringEnum([ 'contact-successful', 'contact-failed', 'contact-mailbox' ])
var CSVSchema = (bag = {}) => {
    var { subjectType } = bag;

    var required = {
        'subjectId': ForeignId({
            collection: 'subject', recordType: subjectType
        }),
        'contactType': StringEnum([ 'email' ]),
        'date': DateYMD(),
        'time': TimeHM(),
    };
    var optional = {
        'comment': FullText(),
    }

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required)
    });

    return schema;
}

// TODO: move
var DateYMD = (bag = {}) => {
    var schema = { ...bag, type: 'string', format: 'date' };
    return schema;
}

// TODO: move
var TimeHM = (bag = {}) => {
    var schema = { ...bag, type: 'string', format: 'time-hm' };
    return schema;
}

module.exports = CSVSchema;
